""" Define the Kubernetes health checks, plus health check of the database. """

import logging
import time

import fastapi
import sqlalchemy.orm
from starlette import responses, status

import models.database
import models.patroni

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
        start: float = time.perf_counter()
        session.execute("SELECT 1")
        elapsed_time: float = time.perf_counter() - start

        if elapsed_time > 1:
            logger.info("Database health check took longer than 1 second: %s", elapsed_time)

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


@router.get("/patroni")
def patroni(response: responses.Response,
            session: sqlalchemy.orm.Session = fastapi.Depends(models.patroni.get_session)):
    """
    Returns a health check for the reachability of the Patroni database.
    """
    try:
        start: float = time.perf_counter()
        session.execute("SELECT 1")
        elapsed_time: float = time.perf_counter() - start

        if elapsed_time > 1:
            logger.info("Patroni health check took longer than 1 second: %s", elapsed_time)

        return {
            "status": STATUS_UP
        }
    except Exception as exception:
        logger.warning("Patroni healthcheck failed", exc_info=True)
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

        return {
            "status": STATUS_DOWN,
            "error": str(exception)
        }
