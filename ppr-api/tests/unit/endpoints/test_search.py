import datetime

import fastapi
import pytest

import endpoints.search
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


class MockSearchRepository:
    def __init__(self, search_result):
        self.search = search_result

    def get_search(self, search_id: int):
        return self.search
