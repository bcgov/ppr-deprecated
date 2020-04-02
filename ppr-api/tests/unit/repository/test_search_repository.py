from unittest.mock import patch

import auth.authentication
import models.payment
import repository.search_repository
import schemas.payment
import schemas.search


@patch('sqlalchemy.orm.Session')
def test_create_search_fills_column_fields(mock_session):
    repo = repository.search_repository.SearchRepository(mock_session)
    search_input = schemas.search.SearchBase(type=schemas.search.SearchType.MHR_NUMBER.value, criteria={'value': '123'})
    user = auth.authentication.User(user_id='12345', user_name='fred', account_id='54321')
    payment = schemas.payment.Payment(id=1234, status='COMPLETED', method='CC')

    search = repo.create_search(search_input, [], [], user, payment)

    assert search.criteria == {'value': '123'}
    assert search.type_code == schemas.search.SearchType.MHR_NUMBER.value
    assert search.user_id == '12345'
    assert search.account_id == '54321'


@patch('sqlalchemy.orm.Session')
def test_create_search_with_exact_matches(mock_session):
    repo = repository.search_repository.SearchRepository(mock_session)
    search_input = schemas.search.SearchBase(type=schemas.search.SearchType.MHR_NUMBER.value, criteria={'value': '123'})
    user = auth.authentication.User(user_id='12345', user_name='fred')
    payment = schemas.payment.Payment(id=1234, status='COMPLETED', method='CC')

    search = repo.create_search(search_input, ['123456A', '987654Z'], [], user, payment)

    assert len(search.results) == 2
    assert len(list(map(lambda it: it.registration_number, search.results))) == 2
    for sr in search.results:
        assert sr.registration_number in ['123456A', '987654Z']
        assert sr.exact is True
        assert sr.selected is True


@patch('sqlalchemy.orm.Session')
def test_create_search_with_inexact_matches(mock_session):
    repo = repository.search_repository.SearchRepository(mock_session)
    search_input = schemas.search.SearchBase(type=schemas.search.SearchType.MHR_NUMBER.value, criteria={'value': '123'})
    user = auth.authentication.User(user_id='12345', user_name='fred')
    payment = schemas.payment.Payment(id=1234, status='COMPLETED', method='CC')

    search = repo.create_search(search_input, [], ['123456A', '987654Z'], user, payment)

    assert len(search.results) == 2
    assert len(list(map(lambda it: it.registration_number, search.results))) == 2
    for sr in search.results:
        assert sr.registration_number in ['123456A', '987654Z']
        assert sr.exact is False
        assert sr.selected is False


@patch('sqlalchemy.orm.Session')
def test_create_search_applies_payment(mock_session):
    repo = repository.search_repository.SearchRepository(mock_session)
    search_input = schemas.search.SearchBase(type=schemas.search.SearchType.MHR_NUMBER.value, criteria={'value': '123'})
    user = auth.authentication.User(user_id='12345', user_name='fred')
    payment = schemas.payment.Payment(id=1234, status='CREATED', method='DRAW_DOWN')

    search = repo.create_search(search_input, [], ['123456A', '987654Z'], user, payment)

    assert isinstance(search.payment, models.payment.Payment)
    assert search.payment.id == payment.id
    assert search.payment.method == payment.method
    assert search.payment.status == payment.status
