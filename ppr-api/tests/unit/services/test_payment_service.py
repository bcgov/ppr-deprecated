import http
from unittest.mock import patch

import fastapi.security.http
import pytest
import requests

import services.payment_service


@patch('requests.post')
def test_create_payment_request_is_successful(mock_post):
    mock_post.return_value = requests.Response()
    mock_post.return_value.status_code = http.HTTPStatus.CREATED.value
    mock_post.return_value._content = b'{"id": 1234, "paymentMethod": "CC", "statusCode": "CREATED"}'
    credentials = fastapi.security.http.HTTPAuthorizationCredentials(scheme='Bearer', credentials='token_value')
    service = services.payment_service.PaymentService(credentials, '123456')

    payment = service.create_payment(services.payment_service.FilingCode.SEARCH)

    assert payment.id == 1234
    assert payment.status == 'CREATED'
    assert payment.method == 'CC'


@patch('requests.post')
def test_create_payment_request_with_bad_auth_response(mock_post):
    mock_post.return_value = requests.Response()
    mock_post.return_value.status_code = http.HTTPStatus.FORBIDDEN
    mock_post.return_value._content = b'{"code": "error_code", "description": "Reason for restriction"}'
    credentials = fastapi.security.http.HTTPAuthorizationCredentials(scheme='Bearer', credentials='token_value')
    service = services.payment_service.PaymentService(credentials, '123456')

    try:
        service.create_payment(services.payment_service.FilingCode.SEARCH)
    except fastapi.HTTPException as ex:
        assert ex.status_code == http.HTTPStatus.FORBIDDEN.value
        assert ex.detail == 'Reason for restriction'
    else:
        pytest.fail('An error was expected since the payment api returned forbidden')


@patch('requests.post')
def test_create_payment_request_with_unexpected_response(mock_post):
    mock_post.return_value = requests.Response()
    mock_post.return_value.status_code = http.HTTPStatus.NOT_FOUND
    mock_post.return_value._content = b'Non JSON Content - Not Found'
    credentials = fastapi.security.http.HTTPAuthorizationCredentials(scheme='Bearer', credentials='token_value')
    service = services.payment_service.PaymentService(credentials, '123456')

    try:
        service.create_payment(services.payment_service.FilingCode.SEARCH)
    except fastapi.HTTPException as ex:
        assert ex.status_code == http.HTTPStatus.INTERNAL_SERVER_ERROR.value
        assert ex.detail == http.HTTPStatus.INTERNAL_SERVER_ERROR.phrase
    else:
        pytest.fail('A general error was expected since the payment api returned an unexpected response')
