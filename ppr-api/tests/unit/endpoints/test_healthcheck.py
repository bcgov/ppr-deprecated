from starlette import responses, status

from endpoints import healthcheck


def test_database_status_without_exception():
    expected = 'UP'
    response = responses.Response()

    actual = healthcheck.database(response, MockSession())

    assert expected == actual['status']
    assert status.HTTP_200_OK == response.status_code


def test_database_status_with_exception():
    expected = 'DOWN'
    response = responses.Response()

    actual = healthcheck.database(response, MockSession(True))

    assert expected == actual['status']
    assert status.HTTP_503_SERVICE_UNAVAILABLE == response.status_code


class MockSession:
    def __init__(self, should_fail=False):
        self.should_fail = should_fail

    def execute(self, sql):
        if self.should_fail:
            raise Exception('execute failed intentionally')
        return None
