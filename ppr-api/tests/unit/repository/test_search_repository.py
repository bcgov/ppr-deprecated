from unittest.mock import patch

import auth.authentication
import repository.search_repository
import schemas.search


@patch('sqlalchemy.orm.Session')
def test_create_search_fills_column_fields(mock_session):
    repo = repository.search_repository.SearchRepository(mock_session)
    search_input = schemas.search.SearchBase(type=schemas.search.SearchType.MHR_NUMBER.value, criteria={'value': '123'})
    user = auth.authentication.User(user_id='12345', user_name='fred')

    search = repo.create_search(search_input, [], [], user)

    assert search.criteria == {'value': '123'}
    assert search.type_code == schemas.search.SearchType.MHR_NUMBER.value
    assert search.user_id == '12345'


@patch('sqlalchemy.orm.Session')
def test_create_search_with_exact_matches(mock_session):
    repo = repository.search_repository.SearchRepository(mock_session)
    search_input = schemas.search.SearchBase(type=schemas.search.SearchType.MHR_NUMBER.value, criteria={'value': '123'})
    user = auth.authentication.User(user_id='12345', user_name='fred')

    search = repo.create_search(search_input, ['123456A', '987654Z'], [], user)

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

    search = repo.create_search(search_input, [], ['123456A', '987654Z'], user)

    assert len(search.results) == 2
    assert len(list(map(lambda it: it.registration_number, search.results))) == 2
    for sr in search.results:
        assert sr.registration_number in ['123456A', '987654Z']
        assert sr.exact is False
        assert sr.selected is False
