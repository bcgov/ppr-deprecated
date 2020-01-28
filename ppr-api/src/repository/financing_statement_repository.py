import fastapi
import sqlalchemy.orm

import models.financing_statement


class FinancingStatementRepository:
    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        self.db = session

    def find_event_by_registration_number(self, registration_number: str):
        return self.db.query(models.financing_statement.FinancingStatementEvent)\
            .filter(models.financing_statement.FinancingStatementEvent.registration_number.ilike(registration_number))\
            .first()
