""" Define the endpoints for searching. """

import json
from uuid import UUID

import fastapi
import requests
from starlette import responses

import config
import schemas.search

router = fastapi.APIRouter()


# TODO: read the ims-api endpoint from an environment variable.
@router.get("/search")
async def search(serial: str, response: responses.Response):
    """
    Find financial statements that match the search criteria.

        Parameters:
            serial: The serial number to search for.
    """
    ims_response = requests.get(config.IMS_API_URL + "/search?serial={}".format(serial))

    response.status_code = ims_response.status_code

    return json.loads(ims_response.content.decode("utf-8"))


@router.get("/searches/{search_id}", response_model=schemas.search.Search)
def read_search(search_id: UUID):
    """
    Get the details for a previously submitted search request

        Parameters:
            search_id: The identifier of the search instance to lookup
        Returns:
            schemas.search.Search
    """
    search_rec = schemas.search.Search(
        id=search_id,
        criteria=schemas.search.SearchCriteria(baseRegistrationNumber="123456B"))
    return search_rec
