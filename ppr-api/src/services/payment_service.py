import enum
import http
import logging

import requests
from fastapi import Depends, Header, HTTPException
from fastapi.security.http import HTTPAuthorizationCredentials

import auth.authentication
import config
import schemas.payment


logger = logging.getLogger(__name__)

CORP_TYPE = 'PPR'


class FilingCode(enum.Enum):
    SEARCH = 'SERCH'
    YEARLY_REGISTRATION = 'FSREG'
    INFINITE_REGISTRATION = 'INFRG'


class PaymentService:
    auth_header: HTTPAuthorizationCredentials
    account_id: str

    def __init__(self, auth_header: HTTPAuthorizationCredentials = Depends(auth.authentication.bearer_scheme),
                 account_id: str = Header(None)):
        self.auth_header = auth_header
        self.account_id = account_id

    def create_payment(self, filing_code: FilingCode):
        request = {
            'businessInfo': {'corpType': CORP_TYPE},
            'filingInfo': {'filingTypes': [{'filingTypeCode': filing_code.value}]}
        }
        pay_response = requests.post(
            '{}/payment-requests'.format(config.PAY_API_URL), json=request,
            headers={
                'Authorization': '{} {}'.format(self.auth_header.scheme, self.auth_header.credentials),
                'Account-Id': self.account_id
            }
        )

        try:
            auth.authentication.check_auth_response(pay_response)
        except HTTPException as auth_ex:
            logger.error('Create Payment call failed auth with status {}.  Response body: {}'.format(
                pay_response.status_code, pay_response.text))
            raise auth_ex

        if not pay_response:  # status_code is unsuccessful
            logger.error('Create Payment call failed unexpectedly with status {}.  Response body: {}'.format(
                pay_response.status_code, pay_response.text))
            raise HTTPException(status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR)

        body = pay_response.json()
        return schemas.payment.Payment(id=body['id'], status=body['statusCode'], method=body['paymentMethod'])
