""" Define the endpoints for searching. """

import typing

import fastapi
from starlette import responses, status

import auth.authentication
import models.financing_statement
import models.search
import schemas.collateral
import schemas.financing_statement
import schemas.party
from schemas.party import PartyType
import schemas.payment
import schemas.search
import services.payment_service
import repository.financing_statement_repository
import repository.search_repository

router = fastapi.APIRouter()


@router.get('/searches/{search_id}', response_model=schemas.search.Search, response_model_by_alias=False)
def read_search(search_id: int, search_repository: repository.search_repository.SearchRepository = fastapi.Depends(),
                user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    """
    Get the details for a previously submitted search request

        Parameters:
            search_id: The identifier of the search instance to lookup
        Returns:
            schemas.search.Search
    """
    search_db_row = search_repository.get_search(search_id)
    if search_db_row is None:
        raise fastapi.HTTPException(status_code=404, detail='Search record not found')
    return search_db_row


@router.post('/searches', response_model=schemas.search.Search, response_model_by_alias=False)
def create_search(response: responses.Response, search_input: schemas.search.SearchBase,
                  search_repository: repository.search_repository.SearchRepository = fastapi.Depends(),
                  fs_repo: repository.financing_statement_repository.FinancingStatementRepository = fastapi.Depends(),
                  user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user),
                  payment: schemas.payment.Payment = fastapi.Depends(services.payment_service.get_payment)):
    exact_matches = []
    similar_matches = []
    criteria_value = search_input.criteria['value'].strip() if 'value' in search_input.criteria else None

    if search_input.type == schemas.search.SearchType.REGISTRATION_NUMBER.value:
        fs_event = fs_repo.find_event_by_registration_number(criteria_value)
        if fs_event:
            exact_matches = [fs_event.registration_number]

    search_model = search_repository.create_search(search_input, exact_matches, similar_matches, user, payment)
    response.status_code = status.HTTP_201_CREATED

    return search_model


@router.get('/searches/{search_id}/results', response_model=typing.List[schemas.search.SearchResult],
            response_model_by_alias=False)
def read_search_results(search_id: int,
                        search_repository: repository.search_repository.SearchRepository = fastapi.Depends(),
                        user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    """
    List the results for the provided search

        Parameters:
            search_id: The identifier of the search instance to lookup
        Returns:
            typing.List[schemas.search.SearchResult]
    """
    search_db_row = search_repository.get_search(search_id)
    if search_db_row is None:
        raise fastapi.HTTPException(status_code=404, detail='Search record not found')

    return list(map(map_search_result_output, search_db_row.results))


def map_search_result_output(search_result: models.search.SearchResult):
    search_result_type = schemas.search.SearchResultType(search_result.exact).name
    event = search_result.financing_statement_event
    financing_statement = rebuild_financing_statement_to_event(event)

    return schemas.search.SearchResult(type=search_result_type, financingStatement=financing_statement)


def map_general_collateral_model_to_schema(model: models.collateral.GeneralCollateral):
    return schemas.collateral.GeneralCollateral(description=model.description)


def rebuild_financing_statement_to_event(event: models.financing_statement.FinancingStatementEvent):
    """
    Given an event, provide a Financing Statement result that represents the state as once that event was applied. This
    is done by applying events in order and ignoring events that occur after the one provided.

        Parameters:
            event: The FinancingStatementEvent for an individual search result
        Returns:
            schemas.financing_statement.FinancingStatement
    """
    fs_model = event.base_registration
    target_events = sorted(filter(lambda e: e.registration_date <= event.registration_date, fs_model.events),
                           key=lambda e: e.registration_date)

    parties_snapshot = []
    general_collateral_snapshot = []
    for applied_event in target_events:
        # remove entities that end with the new event, and add those that were introduced
        parties_snapshot = filter_ending(applied_event.registration_number, parties_snapshot)
        parties_snapshot.extend(applied_event.starting_parties)
        general_collateral_snapshot = filter_ending(applied_event.registration_number, general_collateral_snapshot)
        general_collateral_snapshot.extend(applied_event.starting_general_collateral)

    reg_party_model = next((p for p in parties_snapshot if p.type_code == PartyType.REGISTERING.value), None)
    reg_party_schema = schemas.party.Party(
        personName=schemas.party.IndividualName(first=reg_party_model.first_name, middle=reg_party_model.middle_name,
                                                last=reg_party_model.last_name)
    ) if reg_party_model else None
    general_collateral_schema = list(map(map_general_collateral_model_to_schema, general_collateral_snapshot))

    return schemas.financing_statement.FinancingStatement(
        baseRegistrationNumber=event.base_registration_number, registrationDateTime=event.registration_date,
        documentId=event.document_number, expiryDate=fs_model.expiry_date,
        registeringParty=reg_party_schema, securedParties=[], debtors=[],
        vehicleCollateral=[], generalCollateral=general_collateral_schema,
        type=schemas.financing_statement.RegistrationType(fs_model.registration_type_code).name
    )


def filter_ending(registration_number: str, items: list):
    """
    Get a subset of the provided list that excludes items that were not removed for the specified registration number
    :param registration_number: The registration number to filter out items for
    :param items: A list of items to be filtered.  Must have a 'ending_registration_number' attribute
    :return: The filtered list
    """
    return list(filter(lambda item: item.ending_registration_number != registration_number, items))
