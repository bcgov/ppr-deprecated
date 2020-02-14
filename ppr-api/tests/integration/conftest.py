import pytest

import auth.authentication
import services.payment_service
import main


@pytest.fixture(autouse=True)
def default_current_user():
    """Override the get_current_user Fast API dependency to eliminate the need for an external Auth API service"""
    def mock_get_current_user():
        return auth.authentication.User(user_id='fake_user_id', user_name='fake_user_name')

    main.app.dependency_overrides[auth.authentication.get_current_user] = mock_get_current_user


@pytest.fixture(autouse=True)
def default_payment():
    """Override the get_payment Fast API dependency to eliminate the need for an external Payment service"""
    def mock_get_payment():
        return services.payment_service.Payment(id=1234, status='CREATED', method='CC')

    main.app.dependency_overrides[services.payment_service.get_payment] = mock_get_payment
