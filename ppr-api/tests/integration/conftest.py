import pytest

import auth.authentication
import main
import models.database
import schemas.payment
import services.payment_service


# search.payment_id has a unique constraint, so tests increment it on each use.  Get the max value as a start point.
db = models.database.SessionLocal()
last_payment_id = db.execute('SELECT COALESCE(MAX(id), 0) FROM payment').first()[0]
db.close()


@pytest.fixture(autouse=True)
def default_remote_user_dependency():
    """Override the get_user_from_auth Fast API dependency to eliminate the need for an external Auth API service"""
    def mock_get_user_from_auth():
        return {'keycloakGuid': 'fake_user_id', 'username': 'fake_user_name'}

    main.app.dependency_overrides[auth.authentication.get_user_from_auth] = mock_get_user_from_auth


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
    """Override the PaymentService Fast API dependency to eliminate the need for an external Payment service"""
    main.app.dependency_overrides[services.payment_service.PaymentService] = MockPaymentService


class MockPaymentService:
    def create_payment(self, filing_code: services.payment_service.FilingCode):
        return create_mock_remote_payment()
