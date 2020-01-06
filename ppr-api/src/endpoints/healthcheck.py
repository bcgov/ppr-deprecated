import logging

import fastapi
import sqlalchemy.orm
from starlette import responses, status

import models.database

router = fastapi.APIRouter()
logger = logging.getLogger(__name__)

STATUS_UP = "UP"
STATUS_DOWN = "DOWN"


@router.get("/health")
def health():
    """
    Returns a health check for this service - if reachable always indicates up.
    """
    return {
        "status": STATUS_UP
    }


@router.get("/database")
def database(response: responses.Response,
             session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
    """
    Returns a health check for the reachability of the database.
    """
    try:
        session.execute("SELECT 1")

        return {
            "status": STATUS_UP
        }
    except Exception as exception:
        logger.warning("EDB database healthcheck failed", exc_info=True)
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

        return {
            "status": STATUS_DOWN,
            "error": str(exception)
        }
