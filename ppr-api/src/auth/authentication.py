import http
import logging

import fastapi
import fastapi.security
import fastapi.security.http
import requests
from pydantic import BaseModel

import config

logger = logging.getLogger(__name__)

bearer_scheme = fastapi.security.HTTPBearer()


def get_user_from_auth(auth: fastapi.security.http.HTTPAuthorizationCredentials = fastapi.Depends(bearer_scheme)):
    auth_response = requests.get('{}/users/@me'.format(config.AUTH_API_URL),
                                 headers={'Authorization': '{} {}'.format(auth.scheme, auth.credentials)})

    if not auth_response:  # status_code is unsuccessful
        if auth_response.status_code in [http.HTTPStatus.UNAUTHORIZED, http.HTTPStatus.FORBIDDEN]:
            body = auth_response.json()
            raise fastapi.HTTPException(
                status_code=auth_response.status_code, detail=body['description']
            )
        logger.error('Get User call failed unexpectedly with status {}.  Response body: {}'.format(
            auth_response.status_code, auth_response.text))
        raise fastapi.HTTPException(
            status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR
        )

    return auth_response.json()


def get_current_user(auth_api_user: dict = fastapi.Depends(get_user_from_auth)):
    return User(user_id=auth_api_user['keycloakGuid'], user_name=auth_api_user['username'])


class User(BaseModel):
    user_id: str
    user_name: str
