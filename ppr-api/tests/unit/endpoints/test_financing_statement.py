import datetime

import datedelta
import fastapi
import pytest

import endpoints.financing_statement
import models.financing_statement
import schemas.financing_statement
from schemas.financing_statement import RegistrationType


def test_read_financing_statement_maps_model_to_schema():
    base_reg_num = '123456A'
    stub_fs = stub_financing_statement(base_reg_num)
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert isinstance(result, schemas.financing_statement.FinancingStatement)
    assert result.baseRegistrationNumber == base_reg_num


def test_read_financing_statement_not_found():
    repo = MockFinancingStatementRepository(None)

    try:
        endpoints.financing_statement.read_financing_statement('987654Z', repo)
    except fastapi.HTTPException as ex:
        assert ex.status_code == 404
    else:
        pytest.fail('A Not Found error was expected')


def test_read_financing_statement_life_years_is_none_when_negative():
    base_reg_num = '123456B'
    stub_fs = stub_financing_statement(base_reg_num, years=-1)
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.years is None
    assert result.expiryDate == stub_fs.expiry_date  # expiry_date is None in this case


def test_read_financing_statement_life_years_is_applied_when_positive():
    base_reg_num = '123456B'
    stub_fs = stub_financing_statement(base_reg_num, years=25)
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.years == 25
    assert result.expiryDate == stub_fs.expiry_date


def test_read_financing_statement_includes_registration_type_name():
    base_reg_num = '123456C'
    stub_fs = stub_financing_statement(base_reg_num, reg_type=RegistrationType.REPAIRERS_LIEN)
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.type == RegistrationType.REPAIRERS_LIEN.name


def test_read_financing_statement_registration_date_taken_from_base_event():
    base_reg_num = '123456C'
    stub_fs = stub_financing_statement(base_reg_num)
    stub_fs.last_updated = datetime.datetime.now() + datetime.timedelta(seconds=1)
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.registrationDateTime == stub_fs.events[0].registration_date


def stub_financing_statement(base_reg_number: str, years: int = -1,
                             reg_type: RegistrationType = RegistrationType.SECURITY_AGREEMENT):
    expiry = datetime.date.today() + datedelta.datedelta(years=years) if years > 0 else None
    return models.financing_statement.FinancingStatement(
        registration_number=base_reg_number, registration_type_code=reg_type.value, status='A', discharged=False,
        life_in_years=years, expiry_date=expiry, last_updated=datetime.datetime.now(),
        events=[models.financing_statement.FinancingStatementEvent(
            registration_number=base_reg_number, base_registration_number=base_reg_number,
            registration_date=datetime.datetime.now()
        )]
    )


class MockFinancingStatementRepository:
    def __init__(self, financing_statement_result):
        self.financing_statement = financing_statement_result

    def get_financing_statement(self, base_registration_number: str):
        if self.financing_statement:
            assert base_registration_number == self.financing_statement.registration_number
        return self.financing_statement
