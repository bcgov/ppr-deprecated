import datedelta
import fastapi
import sqlalchemy.orm

import auth.authentication
import models.collateral
import models.database
import models.financing_statement
import models.party
import schemas.financing_statement
import schemas.party
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
        event_model = models.financing_statement.FinancingStatementEvent(registration_number=reg_num,
                                                                         user_id=user.user_id)

        party_schema = fs_input.registeringParty
        reg_party_model = models.party.Party(type_code=schemas.party.PartyType.REGISTERING.value,
                                             first_name=party_schema.personName.first,
                                             middle_name=party_schema.personName.middle,
                                             last_name=party_schema.personName.last)

        general_collateral = list(map(lambda c: models.collateral.GeneralCollateral(description=c.description),
                                      fs_input.generalCollateral))

        model.events.append(event_model)
        model.parties.append(reg_party_model)
        model.general_collateral.extend(general_collateral)
        event_model.starting_parties.append(reg_party_model)
        event_model.starting_general_collateral.extend(general_collateral)

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
