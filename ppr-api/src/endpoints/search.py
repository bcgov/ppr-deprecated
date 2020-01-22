""" Define the endpoints for searching. """

import datetime
import json
import typing

import fastapi
import requests
from starlette import responses, status

import config
import models.search
import schemas.financing_statement
import schemas.search
import repository.search_repository

router = fastapi.APIRouter()


# TODO: read the ims-api endpoint from an environment variable.
@router.get('/search')
async def search(serial: str, response: responses.Response):
    """
    Find financial statements that match the search criteria.

        Parameters:
            serial: The serial number to search for.
    """
    ims_response = requests.get(config.IMS_API_URL + '/search?serial={}'.format(serial))

    response.status_code = ims_response.status_code

    return json.loads(ims_response.content.decode('utf-8'))


@router.get('/searches/{search_id}', response_model=schemas.search.Search, response_model_by_alias=False)
def read_search(search_id: int, search_repository: repository.search_repository.SearchRepository = fastapi.Depends()):
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
                  search_repository: repository.search_repository.SearchRepository = fastapi.Depends()):
    exact_matches = []
    similar_matches = []
    # TODO execute the search query and create search_result records. See https://github.com/bcgov/ppr/issues/222
    # The financing statements are not yet available to search, so create an exact match for now
    if search_input.type == schemas.search.SearchType.REGISTRATION_NUMBER.value:
        exact_matches = [search_input.criteria['value']]

    search_model = search_repository.create_search(search_input, exact_matches, similar_matches)
    response.status_code = status.HTTP_201_CREATED
    return search_model


@router.get('/searches/{search_id}/results', response_model=typing.List[schemas.search.SearchResult],
            response_model_by_alias=False)
def read_search_results(search_id: int,
                        search_repository: repository.search_repository.SearchRepository = fastapi.Depends()):
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
    # TODO Showing dummy data for the moment, complete as the data model fills out. Issue #222.
    fin_stmt = schemas.financing_statement.FinancingStatement(
        baseRegistrationNumber=search_result.registration_number, documentId='B9876543',
        registrationDateTime=datetime.datetime.now(), registeringParty={}, securedParties=[], debtors=[],
        vehicleCollateral=[], generalCollateral=[],
        type=schemas.financing_statement.RegistrationType.SECURITY_AGREEMENT.name
    )
    search_result_type = schemas.search.SearchResultType(search_result.exact).name
    return schemas.search.SearchResult(type=search_result_type, financingStatement=fin_stmt)
