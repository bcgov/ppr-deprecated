import endpoints.healthcheck


def test_database_status_without_exception():
    expected = "UP"
    actual = endpoints.healthcheck.database_status(MockSession())
    assert expected == actual


def test_database_status_throws_exception():
    expected = "DOWN"
    actual = endpoints.healthcheck.database_status(MockSession(True))
    assert expected == actual


class MockSession:
    def __init__(self, should_fail=False):
        self.should_fail = should_fail

    def execute(self, sql):
        if self.should_fail:
            raise Exception('execute failed intentionally')
        return None
