"""Define the endpoints for searching."""

import typing

import datedelta
import fastapi
from starlette import responses, status

import auth.authentication
import models.collateral
import models.financing_statement
import models.party
import models.search
import repository.financing_statement_repository
import repository.search_repository
import schemas.collateral
import schemas.financing_statement
import schemas.party
import schemas.payment
import schemas.search
import services.payment_service
import services.search_execution_service
import utils.datetime
from schemas.financing_statement import RegistrationType
from schemas.party import PartyType


router = fastapi.APIRouter()


@router.get('/searches/{search_id}', response_model=schemas.search.Search, response_model_by_alias=False)
def read_search(search_id: int, search_repository: repository.search_repository.SearchRepository = fastapi.Depends(),
                user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    """
    Get the details for a previously submitted search request.

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
                  search_exec_service: services.search_execution_service.SearchExecutionService = fastapi.Depends(),
                  payment_service: services.payment_service.PaymentService = fastapi.Depends()):
    """Submit and execute a new search."""
    exact_matches = []
    similar_matches = []
    criteria_value = search_input.criteria['value'].strip() if 'value' in search_input.criteria else None

    if search_input.type == schemas.search.SearchType.REGISTRATION_NUMBER.value:
        match = search_exec_service.find_latest_event_number_for_registration_number(criteria_value)
        exact_matches = [match] if match else []
    elif search_input.type == schemas.search.SearchType.MHR_NUMBER.value:
        exact_matches = search_exec_service.find_latest_event_numbers_for_mhr_number(criteria_value)

    payment = payment_service.create_payment(services.payment_service.FilingCode.SEARCH)
    search_model = search_repository.create_search(search_input, exact_matches, similar_matches, user, payment)
    response.status_code = status.HTTP_201_CREATED

    return search_model


@router.get('/searches/{search_id}/results', response_model=typing.List[schemas.search.SearchResult],
            response_model_by_alias=False)
def read_search_results(search_id: int,
                        search_repository: repository.search_repository.SearchRepository = fastapi.Depends(),
                        user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    """
    List the results for the provided search.

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
    """Convert a search result database object to its external facing schema representation."""
    search_result_type = schemas.search.SearchResultType(search_result.exact).name
    event = search_result.financing_statement_event
    financing_statement = rebuild_financing_statement_to_event(event)

    return schemas.search.SearchResult(type=search_result_type, financingStatement=financing_statement)


def rebuild_financing_statement_to_event(event: models.financing_statement.FinancingStatementEvent):
    """
    Rebuild the state of a financing statement up to the point of the provided event.

    Given an event, provide a Financing Statement result that represents the state as once that event was applied. This
    is done by applying events in order and ignoring events that occur after the one provided.

        Parameters:
            event: The FinancingStatementEvent for an individual search result
        Returns:
            schemas.financing_statement.FinancingStatement
    """
    fs_model = event.base_registration
    is_repairers_lien = fs_model.registration_type_code == RegistrationType.REPAIRERS_LIEN.value
    target_events = sorted(filter(lambda e: e.registration_date <= event.registration_date, fs_model.events),
                           key=lambda e: e.registration_date)
    infinite = None
    years = 0
    expiry = utils.datetime.to_date_pacific(fs_model.get_base_event().registration_date)
    if is_repairers_lien:
        expiry += datedelta.datedelta(days=180)
        years = None

    parties_snapshot = []
    general_collateral_snapshot = []
    vehicle_collateral_snapshot = []
    for applied_event in target_events:
        # remove entities that end with the new event, and add those that were introduced
        parties_snapshot = filter_ending(applied_event.registration_number, parties_snapshot)
        parties_snapshot.extend(applied_event.starting_parties)
        general_collateral_snapshot = filter_ending(applied_event.registration_number, general_collateral_snapshot)
        general_collateral_snapshot.extend(applied_event.starting_general_collateral)
        vehicle_collateral_snapshot = filter_ending(applied_event.registration_number, vehicle_collateral_snapshot)
        vehicle_collateral_snapshot.extend(applied_event.starting_vehicle_collateral)

        # TODO ppr#708 Need to detect Repairer's Lien renewals to increase expiry date by another 180 days
        # Apply the life of each event to capture the combined expiry. This includes renewals.
        if not infinite and not is_repairers_lien:
            if applied_event.life_in_years == -1:
                infinite = True
                years = None
                expiry = None
            elif applied_event.life_in_years and applied_event.life_in_years > 0:
                years += applied_event.life_in_years
                expiry += datedelta.datedelta(years=applied_event.life_in_years)
                infinite = False

    reg_party_model = next((p for p in parties_snapshot if p.type_code == PartyType.REGISTERING.value), None)
    reg_party_schema = reg_party_model.as_schema() if reg_party_model else None
    secured_parties_model = filter(lambda p: p.type_code == PartyType.SECURED.value, parties_snapshot)
    secured_parties_schema = list(map(models.party.Party.as_schema, secured_parties_model))
    debtors_model = filter(lambda p: p.type_code == PartyType.DEBTOR.value, parties_snapshot)
    debtors_schema = list(map(models.party.Party.as_schema, debtors_model))
    vehicle_collateral_schema = list(map(models.collateral.VehicleCollateral.as_schema, vehicle_collateral_snapshot))
    general_collateral_schema = models.collateral.GeneralCollateral.list_as_schema(general_collateral_snapshot,
                                                                                   target_events)

    return schemas.financing_statement.FinancingStatement(
        baseRegistrationNumber=event.base_registration_number, registrationDateTime=event.registration_date,
        documentId=event.document_number, expiryDate=expiry, lifeYears=years, lifeInfinite=infinite,
        trustIndenture=fs_model.trust_indenture, lienAmount=fs_model.lien_amount, surrenderDate=fs_model.surrender_date,
        registeringParty=reg_party_schema, securedParties=secured_parties_schema, debtors=debtors_schema,
        vehicleCollateral=vehicle_collateral_schema, generalCollateral=general_collateral_schema,
        type=schemas.financing_statement.RegistrationType(fs_model.registration_type_code).name
    )


def filter_ending(registration_number: str, items: list):
    """
    Get a subset of the provided list that excludes items that were not removed for the specified registration number.

    :param registration_number: The registration number to filter out items for
    :param items: A list of items to be filtered.  Must have a 'ending_registration_number' attribute
    :return: The filtered list
    """
    return list(filter(lambda item: item.ending_registration_number != registration_number, items))
