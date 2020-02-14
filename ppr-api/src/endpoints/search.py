""" Define the endpoints for searching. """

import typing

import fastapi
from starlette import responses, status

import auth.authentication
import models.search
import schemas.financing_statement
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
                  payment: services.payment_service.Payment = fastapi.Depends(services.payment_service.get_payment)):
    exact_matches = []
    similar_matches = []
    criteria_value = search_input.criteria['value'].strip() if 'value' in search_input.criteria else None

    if search_input.type == schemas.search.SearchType.REGISTRATION_NUMBER.value:
        fs_event = fs_repo.find_event_by_registration_number(criteria_value)
        if fs_event:
            exact_matches = [fs_event.registration_number]

    search_model = search_repository.create_search(search_input, exact_matches, similar_matches, user)
    response.status_code = status.HTTP_201_CREATED

    # TODO capture the payment detail in the database for later use
    result = schemas.search.Search.from_orm(search_model)
    result.payment = payment
    return result


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
    event = search_result.financing_statement_event
    financing_statement = event.base_registration
    fin_stmt = schemas.financing_statement.FinancingStatement(
        baseRegistrationNumber=event.base_registration_number, registrationDateTime=event.registration_date,
        documentId=event.document_number, expiryDate=financing_statement.expiry_date,
        registeringParty={}, securedParties=[], debtors=[], vehicleCollateral=[], generalCollateral=[],
        type=schemas.financing_statement.RegistrationType(financing_statement.registration_type_code).name
    )
    search_result_type = schemas.search.SearchResultType(search_result.exact).name
    return schemas.search.SearchResult(type=search_result_type, financingStatement=fin_stmt)
