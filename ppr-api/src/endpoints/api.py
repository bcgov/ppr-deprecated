""" Set up all the endpoints for the web service. """

import fastapi

from . import search
from . import healthcheck


router = fastapi.APIRouter()

router.include_router(healthcheck.router, prefix='/operations', tags=['Operations'])
router.include_router(search.router, tags=['Search'])
