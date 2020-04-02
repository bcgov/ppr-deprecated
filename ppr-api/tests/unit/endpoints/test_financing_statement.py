import datetime

import datedelta
import fastapi
import pytest

import endpoints.financing_statement
import models.collateral
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

    assert result.lifeYears is None
    assert result.expiryDate == stub_fs.expiry_date  # expiry_date is None in this case


def test_read_financing_statement_life_years_is_applied_when_positive():
    base_reg_num = '123456B'
    stub_fs = stub_financing_statement(base_reg_num, years=25)
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.lifeYears == 25
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

    assert type(result.registeringParty) == schemas.party.Party
    assert result.registeringParty.personName.first == 'Homer'
    assert result.registeringParty.personName.middle == 'Jay'
    assert result.registeringParty.personName.last == 'Simpson'


def test_read_financing_statement_registration_party_should_be_none_when_not_present():
    base_reg_num = '123456C'
    stub_fs = stub_financing_statement(base_reg_num, parties=[])
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert result.registeringParty is None


def test_read_financing_statement_debtor_should_be_mapped_to_schema():
    base_reg_num = '123456C'
    debtor = models.party.Party(
        type_code=PartyType.DEBTOR.value, base_registration_number=base_reg_num,
        starting_registration_number=base_reg_num, first_name='Homer', middle_name='Jay', last_name='Simpson',
        business_name='Mr. Plow', birthdate=datetime.date(1990, 6, 15)
    )
    stub_fs = stub_financing_statement(base_reg_num, parties=[debtor])
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert len(result.debtors) == 1
    debtor = result.debtors[0]
    assert type(debtor) == schemas.party.Debtor
    assert debtor.personName.first == 'Homer'
    assert debtor.personName.middle == 'Jay'
    assert debtor.personName.last == 'Simpson'
    assert debtor.businessName == 'Mr. Plow'
    assert debtor.birthdate == datetime.date(1990, 6, 15)
    assert debtor.address is None


def test_read_financing_statement_debtor_address_should_be_mapped_to_schema():
    base_reg_num = '123456C'
    address_model = models.party.Address(line1='123 Fake Street', line2='Suite 100', city='Victoria', region='BC',
                                         country='CA', postal_code='V1V 1V1')
    debtor = models.party.Party(
        type_code=PartyType.DEBTOR.value, address=address_model, first_name='Homer', last_name='Simpson',
        base_registration_number=base_reg_num, starting_registration_number=base_reg_num
    )
    stub_fs = stub_financing_statement(base_reg_num, parties=[debtor])
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    address_result = result.debtors[0].address
    assert address_result.street == '123 Fake Street'
    assert address_result.streetAdditional == 'Suite 100'
    assert address_result.city == 'Victoria'
    assert address_result.region == 'BC'
    assert address_result.country == 'CA'
    assert address_result.postalCode == 'V1V 1V1'


def test_read_financing_statement_general_collateral_should_be_included():
    base_reg_num = '123456D'
    collateral1 = models.collateral.GeneralCollateral(description='collateral description', index=1)
    collateral2 = models.collateral.GeneralCollateral(description=' plus appended portion', index=2)
    stub_fs = stub_financing_statement(base_reg_num, general_collateral=[collateral1, collateral2])
    collateral1.start_event = stub_fs.get_base_event()
    collateral2.start_event = stub_fs.get_base_event()
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert len(result.generalCollateral) == 1
    assert result.generalCollateral[0].description == 'collateral description plus appended portion'


def test_read_financing_statement_general_collateral_when_list_is_empty():
    base_reg_num = '123456D'
    stub_fs = stub_financing_statement(base_reg_num, general_collateral=[])
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert len(result.generalCollateral) == 0


def test_read_financing_statement_vehicle_collateral_should_be_included():
    base_reg_num = '123456E'
    collateral1 = models.collateral.VehicleCollateral(type_code='BO', serial_number='5654768V2')
    collateral2 = models.collateral.VehicleCollateral(type_code='MH', mhr_number='5678943')
    stub_fs = stub_financing_statement(base_reg_num, vehicle_collateral=[collateral1, collateral2])
    repo = MockFinancingStatementRepository(stub_fs)

    result = endpoints.financing_statement.read_financing_statement(base_reg_num, repo)

    assert len(result.vehicleCollateral) == 2
    assert next(x for x in result.vehicleCollateral if x.serial == '5654768V2')
    assert next(x for x in result.vehicleCollateral if x.manufacturedHomeRegNumber == '5678943')


def stub_financing_statement(base_reg_number: str, years: int = -1, parties: list = None, general_collateral=[],
                             vehicle_collateral=[], reg_type: RegistrationType = RegistrationType.SECURITY_AGREEMENT):
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
        parties=parties, general_collateral=general_collateral, vehicle_collateral=vehicle_collateral
    )


class MockFinancingStatementRepository:
    def __init__(self, financing_statement_result):
        self.financing_statement = financing_statement_result

    def get_financing_statement(self, base_registration_number: str):
        if self.financing_statement:
            assert base_registration_number == self.financing_statement.registration_number
        return self.financing_statement
