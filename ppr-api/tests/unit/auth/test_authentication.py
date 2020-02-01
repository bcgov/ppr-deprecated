import http
from unittest.mock import patch

import fastapi.security.http
import pytest
import requests

import auth.authentication


@patch('requests.get')
def test_get_user_from_auth_with_successful_auth(mock_get):
    mock_get.return_value = requests.Response()
    mock_get.return_value.status_code = http.HTTPStatus.OK
    mock_get.return_value._content = b'{"test": "json"}'
    credentials = fastapi.security.http.HTTPAuthorizationCredentials(scheme='Bearer', credentials='token_value')

    result = auth.authentication.get_user_from_auth(credentials)

    assert result == {'test': 'json'}


@patch('requests.get')
def test_get_user_from_auth_with_forbidden_response(mock_get):
    mock_get.return_value = requests.Response()
    mock_get.return_value.status_code = http.HTTPStatus.FORBIDDEN
    mock_get.return_value._content = b'{"code": "error_code", "description": "Reason for restriction"}'
    credentials = fastapi.security.http.HTTPAuthorizationCredentials(scheme='Bearer', credentials='token_value')

    try:
        auth.authentication.get_user_from_auth(credentials)
    except fastapi.HTTPException as ex:
        assert ex.status_code == http.HTTPStatus.FORBIDDEN
        assert ex.detail == 'Reason for restriction'
    else:
        pytest.fail('An error was expected since the auth api returned forbidden')


@patch('requests.get')
def test_get_user_from_auth_with_unauthorized_response(mock_get):
    mock_get.return_value = requests.Response()
    mock_get.return_value.status_code = http.HTTPStatus.UNAUTHORIZED
    mock_get.return_value._content = b'{"code": "go_away", "description": "No Permission"}'
    credentials = fastapi.security.http.HTTPAuthorizationCredentials(scheme='Bearer', credentials='token_value')

    try:
        auth.authentication.get_user_from_auth(credentials)
    except fastapi.HTTPException as ex:
        assert ex.status_code == http.HTTPStatus.UNAUTHORIZED
        assert ex.detail == 'No Permission'
    else:
        pytest.fail('An error was expected since the auth api returned unauthorized')


@patch('requests.get')
def test_get_user_from_auth_with_unexpected_response(mock_get):
    mock_get.return_value = requests.Response()
    mock_get.return_value.status_code = http.HTTPStatus.NOT_FOUND
    mock_get.return_value._content = b'Non JSON Content - Not Found'
    credentials = fastapi.security.http.HTTPAuthorizationCredentials(scheme='Bearer', credentials='token_value')

    try:
        auth.authentication.get_user_from_auth(credentials)
    except fastapi.HTTPException as ex:
        assert ex.status_code == http.HTTPStatus.INTERNAL_SERVER_ERROR
        assert ex.detail == http.HTTPStatus.INTERNAL_SERVER_ERROR.phrase
    else:
        pytest.fail('A general error was expected since the auth api returned an unexpected response')


def test_get_current_user():
    auth_api_user = {'keycloakGuid': 'dad87b8e-0c80-4c8d-815b-0967cc68d65d',
                     'username': 'bcsc/32b44e37aa6a40019de1068c4891da10'}

    user = auth.authentication.get_current_user(auth_api_user)

    assert user.user_id == 'dad87b8e-0c80-4c8d-815b-0967cc68d65d'
    assert user.user_name == 'bcsc/32b44e37aa6a40019de1068c4891da10'
