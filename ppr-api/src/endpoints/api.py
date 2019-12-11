import fastapi

from . import search


""" Set up all the endpoints for the web service. """
api_router = fastapi.APIRouter()

api_router.include_router(search.router, tags=["Search"])
