"""Contains an IoC injectable repository class for interactions with the database involving Financing Statements."""

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
from schemas.financing_statement import RegistrationType


def map_party_schema_to_model(party_type: schemas.party.PartyType, schema: schemas.party.Party, birthdate=None):
    """Map a party provided from user input to the model object representing the database structure."""
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
    """Map vehicle collateral from user input to the model object representing the database structure."""
    return models.collateral.VehicleCollateral(
        type_code=schemas.collateral.VehicleType[schema.type].value, year=schema.year, make=schema.make,
        model=schema.model, serial_number=schema.serial, mhr_number=schema.manufacturedHomeRegNumber
    )


class FinancingStatementRepository:
    """Class for performing database operations on Financing Statements."""

    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        """Initialize the repository with a session provided by Dependency Injection."""
        self.db = session

    def create_financing_statement(self, fs_input: schemas.financing_statement.FinancingStatementBase,
                                   user: auth.authentication.User):
        """Create a new Financing Statement record with a corresponding event."""
        reg_type = RegistrationType[fs_input.type]
        reg_num = self.next_registration_number()
        today = utils.datetime.today_pacific()
        years = None
        amount = None
        surrender = None
        trust = fs_input.trustIndenture or False if reg_type == RegistrationType.SECURITY_AGREEMENT else None

        if reg_type == RegistrationType.REPAIRERS_LIEN:
            expiry_date = today + datedelta.datedelta(days=180)
            amount = fs_input.lienAmount
            surrender = fs_input.surrenderDate
        else:
            years = -1 if fs_input.lifeInfinite else fs_input.lifeYears
            expiry_date = today + datedelta.datedelta(years=years) if years > 0 else None

        model = models.financing_statement.FinancingStatement(
            registration_number=reg_num, status='A', registration_type_code=reg_type.value, life_in_years=years,
            expiry_date=expiry_date, trust_indenture=trust, lien_amount=amount, surrender_date=surrender,
            account_id=user.account_id
        )
        event_model = models.financing_statement.FinancingStatementEvent(
            registration_number=reg_num, user_id=user.user_id, account_id=user.account_id, life_in_years=years
        )

        reg_party_model = map_party_schema_to_model(schemas.party.PartyType.REGISTERING, fs_input.registeringParty)
        secured_parties = list(map(lambda p: map_party_schema_to_model(schemas.party.PartyType.SECURED, p),
                                   fs_input.securedParties))
        debtors = list(map(lambda p: map_party_schema_to_model(schemas.party.PartyType.DEBTOR, p, p.birthdate),
                           fs_input.debtors))
        vehicle_collateral = list(map(map_vehicle_collateral_schema_to_model, fs_input.vehicleCollateral))
        general_collateral = list(
            map(lambda e: models.collateral.GeneralCollateral(description=e[1].description, index=e[0]),
                enumerate(fs_input.generalCollateral, start=1))
        )

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
        """Find the Financing Statement record with the matching registration number, or None if not found."""
        return self.db.query(models.financing_statement.FinancingStatement).get(base_registration_number)

    def next_registration_number(self):
        """Get the next available Registration Number based on the database sequence."""
        return str(self.db.execute(sqlalchemy.Sequence('reg_number_seq')))
