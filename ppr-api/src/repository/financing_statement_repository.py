import datedelta
import fastapi
import sqlalchemy.orm

import auth.authentication
import models.database
import models.financing_statement
import schemas.financing_statement
import utils.datetime


class FinancingStatementRepository:
    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        self.db = session

    def create_financing_statement(self, fs_input: schemas.financing_statement.FinancingStatementBase,
                                   user: auth.authentication.User):
        reg_num = self.next_registration_number()
        years = fs_input.years or -1
        expiry_date = utils.datetime.today_pacific() + datedelta.datedelta(years=years) if years > 0 else None

        model = models.financing_statement.FinancingStatement(
            registration_number=reg_num, status='A', life_in_years=years, expiry_date=expiry_date,
            registration_type_code=schemas.financing_statement.RegistrationType[fs_input.type].value
        )
        model.events.append(
            models.financing_statement.FinancingStatementEvent(registration_number=reg_num, user_id=user.user_id)
        )

        self.db.add(model)
        self.db.flush()
        self.db.refresh(model)

        return model

    def get_financing_statement(self, base_registration_number: str):
        return self.db.query(models.financing_statement.FinancingStatement).get(base_registration_number)

    def find_event_by_registration_number(self, registration_number: str):
        return self.db.query(models.financing_statement.FinancingStatementEvent)\
            .filter(models.financing_statement.FinancingStatementEvent.registration_number.ilike(registration_number))\
            .first()

    def next_registration_number(self):
        return str(self.db.execute(sqlalchemy.Sequence('reg_number_seq')))
