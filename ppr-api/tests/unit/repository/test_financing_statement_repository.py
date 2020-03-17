import datetime
from unittest.mock import patch

import freezegun

import auth.authentication
import repository.financing_statement_repository
import schemas.collateral
import schemas.financing_statement
import schemas.party
from schemas.collateral import VehicleType
from schemas.financing_statement import RegistrationType
from schemas.party import PartyType


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_event_registration_and_base_registration_are_same(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)

    financing_statement = repo.create_financing_statement(stub_financing_statement_input(), stub_user())

    assert financing_statement.registration_number
    assert len(financing_statement.events) == 1
    assert financing_statement.registration_number == financing_statement.events[0].registration_number


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_event_user_is_saved(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    user = stub_user(user_id='789')

    financing_statement = repo.create_financing_statement(stub_financing_statement_input(), user)

    assert financing_statement.events[0].user_id == '789'


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_should_not_expire_when_years_not_set(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(years=None)

    financing_statement = repo.create_financing_statement(schema, stub_user())

    assert financing_statement.expiry_date is None
    assert financing_statement.life_in_years == -1


@freezegun.freeze_time('2020-02-29 12:00:00')
@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_leap_day_to_non_leap_year_should_expire_in_march(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(years=3)

    financing_statement = repo.create_financing_statement(schema, stub_user())

    assert financing_statement.expiry_date == datetime.date(2023, 3, 1)
    assert financing_statement.life_in_years == 3


@freezegun.freeze_time('2020-02-29 12:00:00')
@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_leap_day_to_leap_year_should_expire_on_leap_day(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(years=24)

    financing_statement = repo.create_financing_statement(schema, stub_user())

    assert financing_statement.expiry_date == datetime.date(2044, 2, 29)
    assert financing_statement.life_in_years == 24


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_type_code_is_enum_value(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(reg_type=RegistrationType.REPAIRERS_LIEN)

    financing_statement = repo.create_financing_statement(schema, stub_user())

    assert financing_statement.registration_type_code == RegistrationType.REPAIRERS_LIEN.value


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_status_is_active(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)

    financing_statement = repo.create_financing_statement(stub_financing_statement_input(), stub_user())

    assert financing_statement.status == 'A'


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_registering_party_is_added_to_financing_statement(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)

    financing_statement = repo.create_financing_statement(stub_financing_statement_input(), stub_user())

    assert financing_statement.get_registering_party()


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_registering_party_is_added_as_starting_on_event(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)

    financing_statement = repo.create_financing_statement(stub_financing_statement_input(), stub_user())

    parties = financing_statement.events[0].starting_parties
    reg_party = next(p for p in parties if p.type_code == PartyType.REGISTERING.value)
    assert reg_party
    assert reg_party.ending_registration_number is None


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_registering_party_name_is_included(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        reg_party=stub_party(person_name=stub_person_name(first='Homer', middle='Jay', last='Simpson'))
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    reg_party = financing_statement.get_registering_party()
    assert reg_party.first_name == 'Homer'
    assert reg_party.middle_name == 'Jay'
    assert reg_party.last_name == 'Simpson'


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_secured_party_business_name_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        secured_parties=[stub_party(business_name='Spacely Sprockets', person_name=None)]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    secured_parties = financing_statement.get_secured_parties()
    assert len(secured_parties) == 1
    assert secured_parties[0].business_name == 'Spacely Sprockets'
    assert secured_parties[0].first_name is None
    assert secured_parties[0].middle_name is None
    assert secured_parties[0].last_name is None


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_secured_party_person_name_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        secured_parties=[stub_party(person_name=stub_person_name(first='Charles', middle='Montgomery', last='Burns'))]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    secured_parties = financing_statement.get_secured_parties()
    assert secured_parties[0].first_name == 'Charles'
    assert secured_parties[0].middle_name == 'Montgomery'
    assert secured_parties[0].last_name == 'Burns'


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_secured_party_address_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        secured_parties=[
            stub_party(
                address=stub_address(street='123 Fake St', street_add='Apt 1', city='Vancouver', region='BC',
                                     country='CA', postal_code='V1V 1V1')
            )]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    secured_parties = financing_statement.get_secured_parties()
    assert secured_parties[0].address.line1 == '123 Fake St'
    assert secured_parties[0].address.line2 == 'Apt 1'
    assert secured_parties[0].address.city == 'Vancouver'
    assert secured_parties[0].address.region == 'BC'
    assert secured_parties[0].address.country == 'CA'
    assert secured_parties[0].address.postal_code == 'V1V 1V1'


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_debtor_business_name_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(debtors=[stub_debtor(business_name='Spacely Sprockets', person_name=None)])

    financing_statement = repo.create_financing_statement(schema, stub_user())

    debtors = financing_statement.get_debtors()
    assert len(debtors) == 1
    assert debtors[0].business_name == 'Spacely Sprockets'
    assert debtors[0].first_name is None
    assert debtors[0].middle_name is None
    assert debtors[0].last_name is None


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_debtor_person_name_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        debtors=[stub_debtor(person_name=stub_person_name(first='Charles', middle='Montgomery', last='Burns'))]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    debtors = financing_statement.get_debtors()
    assert debtors[0].first_name == 'Charles'
    assert debtors[0].middle_name == 'Montgomery'
    assert debtors[0].last_name == 'Burns'


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_debtor_address_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        debtors=[
            stub_debtor(
                address=stub_address(street='123 Fake St', street_add='Apt 1', city='Vancouver', region='BC',
                                     country='CA', postal_code='V1V 1V1')
            )]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    debtors = financing_statement.get_debtors()
    assert debtors[0].address.line1 == '123 Fake St'
    assert debtors[0].address.line2 == 'Apt 1'
    assert debtors[0].address.city == 'Vancouver'
    assert debtors[0].address.region == 'BC'
    assert debtors[0].address.country == 'CA'
    assert debtors[0].address.postal_code == 'V1V 1V1'


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_debtor_birthdate_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        debtors=[stub_debtor(birthdate=datetime.date(1955, 7, 12))]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    debtors = financing_statement.get_debtors()
    assert debtors[0].birthdate == datetime.date(1955, 7, 12)


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_debtor_birthdate_is_none(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        debtors=[stub_debtor(birthdate=None)]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    debtors = financing_statement.get_debtors()
    assert debtors[0].birthdate is None


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_general_collateral_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(general_collateral=[stub_general_collateral('collateral description')])

    financing_statement = repo.create_financing_statement(schema, stub_user())

    collateral = financing_statement.general_collateral
    assert len(collateral) == 1
    assert collateral[0].description == 'collateral description'
    assert collateral[0] in financing_statement.events[0].starting_general_collateral


@patch('sqlalchemy.orm.Session')
def test_create_financing_statement_vehicle_collateral_is_stored(mock_session):
    repo = repository.financing_statement_repository.FinancingStatementRepository(mock_session)
    schema = stub_financing_statement_input(
        vehicle_collateral=[
            stub_vehicle_collateral(vehicle_type=VehicleType.MOTOR_VEHICLE, year=1997, make='Honda', model='Civic',
                                    serial='1HGEJ8258VL115351', mhr_number=None),
            stub_vehicle_collateral(vehicle_type=VehicleType.MANUFACTURED_HOME, mhr_number='7654321')
        ]
    )

    financing_statement = repo.create_financing_statement(schema, stub_user())

    collateral = financing_statement.vehicle_collateral
    assert len(collateral) == 2
    manufactured_home = next(c for c in collateral if c.type_code == VehicleType.MANUFACTURED_HOME.value)
    motor_vehicle = next(c for c in collateral if c.type_code == VehicleType.MOTOR_VEHICLE.value)
    assert manufactured_home.mhr_number == '7654321'
    assert motor_vehicle.year == 1997
    assert motor_vehicle.make == 'Honda'
    assert motor_vehicle.model == 'Civic'
    assert motor_vehicle.serial_number == '1HGEJ8258VL115351'


def stub_address(street: str = '123 Fake St', street_add: str = None, city: str = 'Victoria', region: str = None,
                 country: str = 'CA', postal_code: str = 'V1V 1V1'):
    return schemas.party.Address(street=street, streetAdditional=street_add, city=city, region=region, country=country,
                                 postalCode=postal_code)


def stub_person_name(first: str = 'Fred', last: str = 'Flintstone', middle: str = None):
    return schemas.party.IndividualName(first=first, last=last, middle=middle)


def stub_party(person_name: schemas.party.IndividualName = stub_person_name(), business_name: str = None,
               address: schemas.party.Address = stub_address()):
    return schemas.party.Party(personName=person_name, businessName=business_name, address=address)


def stub_debtor(person_name: schemas.party.IndividualName = stub_person_name(), business_name: str = None,
                birthdate: datetime.date = None, address: schemas.party.Address = stub_address()):
    return schemas.party.Debtor(personName=person_name, businessName=business_name, birthdate=birthdate,
                                address=address)


def stub_general_collateral(description: str):
    return schemas.collateral.GeneralCollateral(description=description)


def stub_vehicle_collateral(vehicle_type: VehicleType = VehicleType.MANUFACTURED_HOME, mhr_number: str = '1234567',
                            serial: str = None, year: int = None, make: str = None, model: str = None):
    return schemas.collateral.VehicleCollateral(
        type=vehicle_type.name, year=year, make=make, model=model, serial=serial, manufacturedHomeRegNumber=mhr_number
    )


def stub_financing_statement_input(reg_type: RegistrationType = RegistrationType.SECURITY_AGREEMENT, years: int = None,
                                   reg_party: schemas.party.Party = stub_party(), secured_parties=[stub_party()],
                                   debtors=[stub_debtor()], general_collateral=[], vehicle_collateral=[]):
    return schemas.financing_statement.FinancingStatementBase(
        type=reg_type.name, years=years, registeringParty=reg_party, securedParties=secured_parties, debtors=debtors,
        vehicleCollateral=vehicle_collateral, generalCollateral=general_collateral
    )


def stub_user(user_id: str = '12345'):
    return auth.authentication.User(user_id=user_id, user_name='fred')
