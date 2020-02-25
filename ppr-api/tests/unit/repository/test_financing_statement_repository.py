import datetime
from unittest.mock import patch

import freezegun

import auth.authentication
import repository.financing_statement_repository
import schemas.financing_statement
from schemas.financing_statement import RegistrationType


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


def stub_financing_statement_input(reg_type: RegistrationType = RegistrationType.SECURITY_AGREEMENT, years: int = None):
    return schemas.financing_statement.FinancingStatementBase(
        type=reg_type.name, years=years, registeringParty={}, securedParties=[], debtors=[],
        vehicleCollateral=[], generalCollateral=[]
    )


def stub_user(user_id: str = '12345'):
    return auth.authentication.User(user_id=user_id, user_name='fred')
