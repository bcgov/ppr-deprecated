from models.financing_statement import FinancingStatement, FinancingStatementEvent
import models.party
from schemas.party import PartyType


def test_get_base_event_should_get_record_with_same_registration_number():
    base_reg_num = '123456A'
    model = FinancingStatement(registration_number=base_reg_num, events=[
        FinancingStatementEvent(registration_number='123457B', base_registration_number=base_reg_num),
        FinancingStatementEvent(registration_number='123459C', base_registration_number=base_reg_num),
        FinancingStatementEvent(registration_number=base_reg_num, base_registration_number=base_reg_num),
        FinancingStatementEvent(registration_number='123458D', base_registration_number=base_reg_num)
    ])

    event = model.get_base_event()

    assert event.registration_number == base_reg_num


def test_get_base_event_is_none_when_base_event_missing():
    # A financing statement without a base event is technically in valid data, but it should not cause an error to occur
    base_reg_num = '123456A'
    model = FinancingStatement(registration_number=base_reg_num, events=[
        FinancingStatementEvent(registration_number='123457B', base_registration_number=base_reg_num),
        FinancingStatementEvent(registration_number='123459C', base_registration_number=base_reg_num),
        FinancingStatementEvent(registration_number='123458D', base_registration_number=base_reg_num)
    ])

    event = model.get_base_event()

    assert event is None


def test_get_registering_party_has_registering_type():
    model = FinancingStatement(parties=[
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Flintstone'),
        models.party.Party(type_code=PartyType.REGISTERING.value, last_name='Jetson'),
        models.party.Party(type_code=PartyType.SECURED.value, last_name='Spacely')
    ])

    reg_party = model.get_registering_party()

    assert reg_party.last_name == 'Jetson'


def test_get_registering_party_is_none_when_parties_empty():
    model = FinancingStatement(parties=[])
    assert model.get_registering_party() is None


def test_get_registering_party_is_none_when_parties_has_no_registering_type():
    model = FinancingStatement(parties=[
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Flintstone'),
        models.party.Party(type_code=PartyType.SECURED.value, last_name='Spacely')
    ])

    assert model.get_registering_party() is None


def test_get_debtors_returns_parties_with_debtor_type():
    model = FinancingStatement(parties=[
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Flintstone'),
        models.party.Party(type_code=PartyType.REGISTERING.value, last_name='Jetson'),
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Rubble'),
        models.party.Party(type_code=PartyType.SECURED.value, last_name='Spacely')
    ])

    debtors = model.get_debtors()

    assert len(debtors) == 2
    assert next(d for d in debtors if d.last_name == 'Flintstone')
    assert next(d for d in debtors if d.last_name == 'Rubble')


def test_get_debtors_is_empty_when_no_debtors():
    model = FinancingStatement(parties=[
        models.party.Party(type_code=PartyType.REGISTERING.value, last_name='Jetson'),
        models.party.Party(type_code=PartyType.SECURED.value, last_name='Spacely')
    ])

    debtors = model.get_debtors()

    assert debtors == []


def test_get_secured_parties_returns_parties_with_secured_type():
    model = FinancingStatement(parties=[
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Flintstone'),
        models.party.Party(type_code=PartyType.SECURED.value, last_name='Slate'),
        models.party.Party(type_code=PartyType.REGISTERING.value, last_name='Jetson'),
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Rubble'),
        models.party.Party(type_code=PartyType.SECURED.value, last_name='Spacely')
    ])

    secured_parties = model.get_secured_parties()

    assert len(secured_parties) == 2
    assert next(s for s in secured_parties if s.last_name == 'Slate')
    assert next(s for s in secured_parties if s.last_name == 'Spacely')


def test_get_secured_parties_is_empty_when_none_present():
    model = FinancingStatement(parties=[
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Flintstone'),
        models.party.Party(type_code=PartyType.REGISTERING.value, last_name='Jetson'),
        models.party.Party(type_code=PartyType.DEBTOR.value, last_name='Rubble')
    ])

    secured_parties = model.get_secured_parties()

    assert secured_parties == []
