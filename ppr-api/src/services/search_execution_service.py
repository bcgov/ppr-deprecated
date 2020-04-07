"""A service module for implementing search functionality."""

import fastapi
import sqlalchemy.orm

import models.database
import schemas.collateral


# Examine active Manufactured Home collateral matching the mhr_number field and retrieve the most recent event
# registration number for the associated financing statement.
MHR_SEARCH_SQL = """
SELECT reg_number
FROM registration r1
JOIN (
        SELECT base_reg_number as base_reg_number, MAX(reg_date) as max_reg_date
        FROM registration
        WHERE base_reg_number IN (
            SELECT base_reg_number
            FROM vehicle
            WHERE vehicle_type_cd = '{}' AND UPPER(mhr_number) = :mhr_number AND reg_number_end IS NULL
        )
        GROUP BY base_reg_number
    ) r2 ON r1.base_reg_number = r2.base_reg_number AND r1.reg_date = r2.max_reg_date
""".format(schemas.collateral.VehicleType.MANUFACTURED_HOME.value)

# Gets the most recent registration number for the financing statement associated with the current registration number.
REGISTRATION_SEARCH_SQL = """
SELECT reg_number
FROM registration r1
JOIN (
        SELECT base_reg_number as base_reg_number, MAX(reg_date) as max_reg_date
        FROM registration
        WHERE base_reg_number IN (
            SELECT base_reg_number
            FROM registration
            WHERE UPPER(reg_number) = :registration_number
        )
        GROUP BY base_reg_number
    ) r2 ON r1.base_reg_number = r2.base_reg_number AND r1.reg_date = r2.max_reg_date
"""


class SearchExecutionService:
    """A Dependency Injection enabled class that encapsulates the business logic for search operations."""

    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        """Initialize the service with a database session provided by Dependency Injection."""
        self.db = session

    def find_latest_event_numbers_for_mhr_number(self, mhr_number: str):
        """Perform a search by MHR Number. Returns a list of event registration numbers."""
        results = self.db.execute(MHR_SEARCH_SQL, {'mhr_number': mhr_number.upper()})
        return list(map(lambda row: row[0], results))

    def find_latest_event_number_for_registration_number(self, reg_number: str):
        """Perform a search by Registration Number. Returns an event registration numbers or None if not found."""
        row = self.db.execute(REGISTRATION_SEARCH_SQL, {'registration_number': reg_number.upper()}).first()
        return row[0] if row else None
