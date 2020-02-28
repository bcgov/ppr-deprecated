import datetime

import datedelta
import fastapi
import pytest

import endpoints.financing_statement
import models.financing_statement
import models.party
import schemas.financing_statement
from schemas.financing_statement import RegistrationType
from schemas.party import PartyType


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


def test_read_financing_statement_registration_is_none_when_base_event_not_present():
    base_reg_num = '123456C'
    stub_fs = stub_financing_statement(base_reg_num)
    stub_fs.events = []
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.registrationDateTime is None


def test_read_financing_statement_registering_party_name_should_be_included():
    base_reg_num = '123456C'
    reg_party = models.party.Party(type_code=PartyType.REGISTERING.value, base_registration_number=base_reg_num,
                                   starting_registration_number=base_reg_num, first_name='Homer', middle_name='Jay',
                                   last_name='Simpson')
    stub_fs = stub_financing_statement(base_reg_num, parties=[reg_party])
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.registeringParty.name.first == 'Homer'
    assert result.registeringParty.name.middle == 'Jay'
    assert result.registeringParty.name.last == 'Simpson'


def test_read_financing_statement_registration_party_should_be_none_when_not_present():
    base_reg_num = '123456C'
    stub_fs = stub_financing_statement(base_reg_num, parties=[])
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.registeringParty is None


def stub_financing_statement(base_reg_number: str, years: int = -1, parties: list = None,
                             reg_type: RegistrationType = RegistrationType.SECURITY_AGREEMENT):
    expiry = datetime.date.today() + datedelta.datedelta(years=years) if years > 0 else None
    parties = [models.party.Party(type_code=PartyType.REGISTERING.value, base_registration_number=base_reg_number,
                                  starting_registration_number=base_reg_number, first_name='Fred',
                                  last_name='Flintstone')] if parties is None else parties
    return models.financing_statement.FinancingStatement(
        registration_number=base_reg_number, registration_type_code=reg_type.value, status='A', discharged=False,
        life_in_years=years, expiry_date=expiry, last_updated=datetime.datetime.now(),
        events=[models.financing_statement.FinancingStatementEvent(
            registration_number=base_reg_number, base_registration_number=base_reg_number,
            registration_date=datetime.datetime.now(), starting_parties=parties
        )],
        parties=parties
    )


class MockFinancingStatementRepository:
    def __init__(self, financing_statement_result):
        self.financing_statement = financing_statement_result

    def get_financing_statement(self, base_registration_number: str):
        if self.financing_statement:
            assert base_registration_number == self.financing_statement.registration_number
        return self.financing_statement
