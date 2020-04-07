"""Define the endpoints for searching."""

import typing

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
    return search_db_row.as_schema()


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

    return search_model.as_schema()


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

    return list(map(models.search.SearchResult.as_schema, search_db_row.results))
