import datedelta
import fastapi
import sqlalchemy.orm

import auth.authentication
import models.collateral
import models.database
import models.financing_statement
import models.party
import schemas.collateral
import schemas.financing_statement
import schemas.party
import utils.datetime


def map_party_schema_to_model(party_type: schemas.party.PartyType, schema: schemas.party.Party, birthdate=None):
    address = models.party.Address(
        line1=schema.address.street, line2=schema.address.streetAdditional, city=schema.address.city,
        region=schema.address.region, country=schema.address.country, postal_code=schema.address.postalCode
    ) if schema.address else None

    return models.party.Party(
        type_code=party_type.value, business_name=schema.businessName, birthdate=birthdate, address=address,
        first_name=schema.personName.first if schema.personName else None,
        middle_name=schema.personName.middle if schema.personName else None,
        last_name=schema.personName.last if schema.personName else None
    )


def map_vehicle_collateral_schema_to_model(schema: schemas.collateral.VehicleCollateral):
    return models.collateral.VehicleCollateral(
        type_code=schemas.collateral.VehicleType[schema.type].value, year=schema.year, make=schema.make,
        model=schema.model, serial_number=schema.serial, mhr_number=schema.manufacturedHomeRegNumber
    )


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

        reg_party_model = map_party_schema_to_model(schemas.party.PartyType.REGISTERING, fs_input.registeringParty)
        secured_parties = list(map(lambda p: map_party_schema_to_model(schemas.party.PartyType.SECURED, p),
                                   fs_input.securedParties))
        debtors = list(map(lambda p: map_party_schema_to_model(schemas.party.PartyType.DEBTOR, p, p.birthdate),
                           fs_input.debtors))

        general_collateral = list(map(lambda c: models.collateral.GeneralCollateral(description=c.description),
                                      fs_input.generalCollateral))
        vehicle_collateral = list(map(map_vehicle_collateral_schema_to_model, fs_input.vehicleCollateral))

        model.events.append(event_model)
        model.parties.append(reg_party_model)
        model.parties.extend(secured_parties)
        model.parties.extend(debtors)
        model.general_collateral.extend(general_collateral)
        model.vehicle_collateral.extend(vehicle_collateral)
        event_model.starting_parties.append(reg_party_model)
        event_model.starting_parties.extend(secured_parties)
        event_model.starting_parties.extend(debtors)
        event_model.starting_general_collateral.extend(general_collateral)
        event_model.starting_vehicle_collateral.extend(vehicle_collateral)

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
