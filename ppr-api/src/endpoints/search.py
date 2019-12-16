""" Define the endpoints for searching. """

import json

import fastapi
import requests
from starlette import responses


router = fastapi.APIRouter()


# TODO: read the ims-api endpoint from an environment variable.
@router.get("/search")
async def search(serial: str, response: responses.Response):
    """
    Find financial statements that match the search criteria.

        Parameters:
            serial: The serial number to search for.
    """
    ims_response = requests.get(
        "https://ims-api-dev.pathfinder.gov.bc.ca/search?serial={}".format(serial)
    )

    response.status_code = ims_response.status_code

    return json.loads(ims_response.content.decode("utf-8"))
