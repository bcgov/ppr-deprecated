import datetime

import fastapi
import pytest

import endpoints.search
import models.collateral
import models.financing_statement
import models.party
import models.search


def test_read_search_returns_value():
    search_record = models.search.Search(id=27, type_code='REGISTRATION_NUMBER', criteria={
                                         'value': '1234'}, creation_date_time=datetime.datetime.now())
    repo = MockSearchRepository(search_record)
    actual = endpoints.search.read_search(27, repo)

    assert search_record == actual


def test_read_search_not_found():
    repo = MockSearchRepository(None)
    try:
        endpoints.search.read_search(27, repo)
    except fastapi.HTTPException as ex:
        assert ex.status_code == 404
    else:
        pytest.fail('A Not Found error was expected')


def test_read_search_results_not_found():
    repo = MockSearchRepository(None)
    try:
        endpoints.search.read_search_results(27, repo)
    except fastapi.HTTPException as ex:
        assert ex.status_code == 404
    else:
        pytest.fail('A Not Found error was expected')


def test_read_search_results_is_empty():
    search_record = models.search.Search(results=[])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)
    assert results == []


def test_read_search_results_has_exact_match():
    stub_fin_stmt_event = stub_financing_statement_event('123456A')
    search_record = models.search.Search(results=[stub_search_result(stub_fin_stmt_event, True)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)
    assert len(results) == 1
    assert results[0].type == 'EXACT'


def test_read_search_results_has_inexact_match():
    stub_fin_stmt_event = stub_financing_statement_event('123456A')
    search_record = models.search.Search(results=[stub_search_result(stub_fin_stmt_event, False)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)
    assert len(results) == 1
    assert results[0].type == 'SIMILAR'


def test_read_search_results_provides_event_base_registration_number():
    stub_fin_stmt_event = stub_financing_statement_event('123456A', '765432B')
    search_record = models.search.Search(results=[stub_search_result(stub_fin_stmt_event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    assert results[0].financingStatement.baseRegistrationNumber == '765432B'


def test_read_search_results_provides_event_registration_date():
    stub_fin_stmt_event = stub_financing_statement_event('123456A')
    stub_fin_stmt_event.registration_date = datetime.datetime.now() - datetime.timedelta(hours=1)
    search_record = models.search.Search(results=[stub_search_result(stub_fin_stmt_event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    assert results[0].financingStatement.registrationDateTime == stub_fin_stmt_event.registration_date


def test_read_search_results_provides_event_document_number():
    stub_fin_stmt_event = stub_financing_statement_event('123456A')
    stub_fin_stmt_event.document_number = 'Z9876543'
    search_record = models.search.Search(results=[stub_search_result(stub_fin_stmt_event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    assert results[0].financingStatement.documentId == 'Z9876543'


def test_read_search_results_provides_financing_statement_expiry_date():
    stub_fin_stmt_event = stub_financing_statement_event('123456A')
    stub_fin_stmt_event.base_registration.expiry_date = datetime.date.today() + datetime.timedelta(days=27)
    search_record = models.search.Search(results=[stub_search_result(stub_fin_stmt_event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    assert results[0].financingStatement.expiryDate == stub_fin_stmt_event.base_registration.expiry_date


def test_read_search_results_provides_secured_party_at_time_of_matched_registration_number():
    now = datetime.datetime.now()
    fin_stmt = models.financing_statement.FinancingStatement(
        registration_number='123456A', registration_type_code='SA', status='A',
        last_updated=now + datetime.timedelta(seconds=2)
    )
    base_event = stub_financing_statement_event(fin_stmt.registration_number, financing_statement=fin_stmt)
    second_event = stub_financing_statement_event('123457B', financing_statement=fin_stmt)
    second_event.registration_date = now + datetime.timedelta(seconds=1)
    third_event = stub_financing_statement_event('123458C', financing_statement=fin_stmt)
    third_event.registration_date = now + datetime.timedelta(seconds=2)
    first_secured_party = models.party.Party(
        type_code='SP', last_name='Simpson', first_name='Homer', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=base_event.registration_number,
        ending_registration_number=second_event.registration_number
    )
    base_event.starting_parties = [first_secured_party]
    second_secured_party = models.party.Party(
        type_code='SP', last_name='Burns', first_name='Charles', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=second_event.registration_number,
        ending_registration_number=third_event.registration_number
    )
    second_event.starting_parties = [second_secured_party]
    second_event.ending_parties = [first_secured_party]
    third_secured_party = models.party.Party(
        type_code='SP', last_name='Wiggum', first_name='Clancy', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=third_event.registration_number
    )
    third_event.starting_parties = [third_secured_party]
    third_event.ending_parties = [second_secured_party]
    fin_stmt.parties = [third_secured_party]
    fin_stmt.events = [base_event, second_event, third_event]
    search_record = models.search.Search(results=[stub_search_result(second_event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    assert len(results[0].financingStatement.securedParties) == 1
    assert results[0].financingStatement.securedParties[0].personName.last == second_secured_party.last_name


def test_read_search_results_provides_debtor_at_time_of_matched_registration_number():
    now = datetime.datetime.now()
    fin_stmt = models.financing_statement.FinancingStatement(
        registration_number='123456A', registration_type_code='SA', status='A',
        last_updated=now + datetime.timedelta(seconds=2)
    )
    base_event = stub_financing_statement_event(fin_stmt.registration_number, financing_statement=fin_stmt)
    second_event = stub_financing_statement_event('123457B', financing_statement=fin_stmt)
    second_event.registration_date = now + datetime.timedelta(seconds=1)
    third_event = stub_financing_statement_event('123458C', financing_statement=fin_stmt)
    third_event.registration_date = now + datetime.timedelta(seconds=2)
    first_debtor = models.party.Party(
        type_code='DE', last_name='Simpson', first_name='Homer', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=base_event.registration_number,
        ending_registration_number=second_event.registration_number
    )
    base_event.starting_parties = [first_debtor]
    second_debtor = models.party.Party(
        type_code='DE', last_name='Burns', first_name='Charles', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=second_event.registration_number,
        ending_registration_number=third_event.registration_number
    )
    second_event.starting_parties = [second_debtor]
    second_event.ending_parties = [first_debtor]
    third_debtor = models.party.Party(
        type_code='DE', last_name='Wiggum', first_name='Clancy', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=third_event.registration_number
    )
    third_event.starting_parties = [third_debtor]
    third_event.ending_parties = [second_debtor]
    fin_stmt.parties = [third_debtor]
    fin_stmt.events = [base_event, second_event, third_event]
    search_record = models.search.Search(results=[stub_search_result(second_event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    assert len(results[0].financingStatement.debtors) == 1
    assert results[0].financingStatement.debtors[0].personName.last == second_debtor.last_name


def test_read_search_results_provides_debtor_details():
    fin_stmt = models.financing_statement.FinancingStatement(
        registration_number='123456A', registration_type_code='SA', status='A', last_updated=datetime.datetime.now()
    )
    event = stub_financing_statement_event(fin_stmt.registration_number)
    debtor = models.party.Party(
        type_code='DE', first_name='Homer', middle_name='Jay', last_name='Simpson', business_name='Mr. Plow',
        birthdate=datetime.date(1990, 6, 15), base_registration_number=fin_stmt.registration_number,
        starting_registration_number=event.registration_number, address=models.party.Address(
            line1='742 Evergreen Terrace', line2='First Floor', city='Springfield', region='BC', country='CA',
            postal_code='H0H 0H0'
        )
    )
    event.starting_parties = [debtor]
    fin_stmt.parties = [debtor]
    fin_stmt.events = [event]
    search_record = models.search.Search(results=[stub_search_result(event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    assert results[0].financingStatement.debtors[0].personName.first == 'Homer'
    assert results[0].financingStatement.debtors[0].personName.middle == 'Jay'
    assert results[0].financingStatement.debtors[0].personName.last == 'Simpson'
    assert results[0].financingStatement.debtors[0].businessName == 'Mr. Plow'
    assert results[0].financingStatement.debtors[0].birthdate == datetime.date(1990, 6, 15)
    assert results[0].financingStatement.debtors[0].address.street == '742 Evergreen Terrace'
    assert results[0].financingStatement.debtors[0].address.streetAdditional == 'First Floor'
    assert results[0].financingStatement.debtors[0].address.city == 'Springfield'
    assert results[0].financingStatement.debtors[0].address.region == 'BC'
    assert results[0].financingStatement.debtors[0].address.country == 'CA'
    assert results[0].financingStatement.debtors[0].address.postalCode == 'H0H 0H0'


def test_read_search_results_provides_vehicle_collateral_at_time_of_matched_registration_number():
    now = datetime.datetime.now()
    fin_stmt = models.financing_statement.FinancingStatement(
        registration_number='123456A', registration_type_code='SA', status='A',
        last_updated=now + datetime.timedelta(seconds=2)
    )
    base_event = stub_financing_statement_event(fin_stmt.registration_number, financing_statement=fin_stmt)
    second_event = stub_financing_statement_event('123457B', financing_statement=fin_stmt)
    second_event.registration_date = now + datetime.timedelta(seconds=1)
    third_event = stub_financing_statement_event('123458C', financing_statement=fin_stmt)
    third_event.registration_date = now + datetime.timedelta(seconds=2)
    first_collateral_remains = models.collateral.VehicleCollateral(
        type_code='MH', serial_number='1', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=base_event.registration_number
    )
    first_collateral_removed = models.collateral.VehicleCollateral(
        type_code='MH', serial_number='2', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=base_event.registration_number,
        ending_registration_number=second_event.registration_number
    )
    base_event.starting_vehicle_collateral = [first_collateral_remains, first_collateral_removed]
    second_collateral = models.collateral.VehicleCollateral(
        type_code='MH', serial_number='3', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=second_event.registration_number,
        ending_registration_number=third_event.registration_number
    )
    second_event.starting_vehicle_collateral = [second_collateral]
    second_event.ending_vehicle_collateral = [first_collateral_removed]
    third_collateral = models.collateral.VehicleCollateral(
        type_code='MH', serial_number='4', base_registration_number=fin_stmt.registration_number,
        starting_registration_number=third_event.registration_number
    )
    third_event.starting_vehicle_collateral = [third_collateral]
    third_event.ending_vehicle_collateral = [second_collateral]
    fin_stmt.vehicle_collateral = [first_collateral_remains, third_collateral]
    fin_stmt.events = [base_event, second_event, third_event]
    search_record = models.search.Search(results=[stub_search_result(second_event)])
    repo = MockSearchRepository(search_record)

    results = endpoints.search.read_search_results(27, repo)

    # The search result was to the second event, so ensure vehicle collateral matches expectations for that state
    result_collateral = results[0].financingStatement.vehicleCollateral
    assert len(result_collateral) == 2
    assert next(c for c in result_collateral if c.serial == first_collateral_remains.serial_number)
    assert next(c for c in result_collateral if c.serial == second_collateral.serial_number)


def stub_financing_statement_event(reg_number: str, base_reg_number: str = None,
                                   financing_statement: models.financing_statement.FinancingStatement = None):
    if financing_statement:
        base_reg_number = financing_statement.registration_number
    elif not base_reg_number:
        base_reg_number = reg_number

    return models.financing_statement.FinancingStatementEvent(
        registration_number=reg_number, base_registration_number=base_reg_number, document_number='A1234567',
        registration_date=datetime.datetime.now(), user_id='user_id_stub',
        base_registration=financing_statement or models.financing_statement.FinancingStatement(
            registration_number=base_reg_number, registration_type_code='SA'
        )
    )


def stub_search_result(registration: models.financing_statement.FinancingStatementEvent,
                       exact: bool = True, selected: bool = True):
    return models.search.SearchResult(exact=exact, selected=selected,
                                      registration_number=registration.registration_number,
                                      financing_statement_event=registration)


class MockSearchRepository:
    def __init__(self, search_result):
        self.search = search_result

    def get_search(self, search_id: int):
        return self.search
