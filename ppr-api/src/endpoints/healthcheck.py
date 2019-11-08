import logging

import fastapi
import sqlalchemy.orm

import models.database

router = fastapi.APIRouter()
logger = logging.getLogger(__name__)

STATUS_UP = "UP"
STATUS_DOWN = "DOWN"


@router.get("/health")
def health(session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
    """
    Returns a health check for this service and external resources. Downstream resources do not affect the overall
    status.
    """
    return {
        "status": STATUS_UP,
        "database": database_status(session)
    }


def database_status(session: sqlalchemy.orm.Session):
    try:
        session.execute('SELECT 1')
        return STATUS_UP
    except Exception:
        logger.warning("Database healthcheck failed", exc_info=True)
        return STATUS_DOWN
