import pytest

import auth.authentication
import models.database
import schemas.payment
import services.payment_service
import main

# search.payment_id has a unique constraint, so tests increment it on each use.  Get the max value as a start point.
db = models.database.SessionLocal()
last_payment_id = db.execute('SELECT COALESCE(MAX(id), 0) FROM payment').first()[0]


@pytest.fixture(autouse=True)
def default_current_user_dependency():
    """Override the get_current_user Fast API dependency to eliminate the need for an external Auth API service"""
    def mock_get_current_user():
        return auth.authentication.User(user_id='fake_user_id', user_name='fake_user_name')

    main.app.dependency_overrides[auth.authentication.get_current_user] = mock_get_current_user


def create_mock_remote_payment():
    global last_payment_id
    last_payment_id += 1
    return schemas.payment.Payment(id=last_payment_id, status='CREATED', method='CC')


@pytest.fixture
def mock_payment():
    """Fixture that can be injected into a test to get a new Payment object directly"""
    return create_mock_remote_payment()


@pytest.fixture(autouse=True)
def default_payment_dependency():
    """Override the get_payment Fast API dependency to eliminate the need for an external Payment service"""
    main.app.dependency_overrides[services.payment_service.get_payment] = create_mock_remote_payment
