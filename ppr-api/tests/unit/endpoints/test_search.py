import datetime

import fastapi
import pytest

import endpoints.search
import models.financing_statement
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


def stub_financing_statement_event(reg_number: str, base_reg_number: str = None):
    if not base_reg_number:
        base_reg_number = reg_number

    return models.financing_statement.FinancingStatementEvent(
        registration_number=reg_number, base_registration_number=base_reg_number, document_number='A1234567',
        registration_date=datetime.datetime.now(), user_id='user_id_stub',
        base_registration=models.financing_statement.FinancingStatement(
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
