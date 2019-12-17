import os


def pytest_configure(config):
    os.environ["DB_PASSWORD"] = "test_password"
    return config
