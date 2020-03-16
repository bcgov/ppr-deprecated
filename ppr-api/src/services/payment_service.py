import http
import logging

from fastapi import Depends, Header, HTTPException
from fastapi.security.http import HTTPAuthorizationCredentials
import requests

import config
import auth.authentication
import schemas.payment

logger = logging.getLogger(__name__)

CORP_TYPE = 'PPR'
SEARCH_FILING_CODE = 'SERCH'


def create_payment_request(auth_header: HTTPAuthorizationCredentials = Depends(auth.authentication.bearer_scheme),
                           account_id: str = Header(None)):
    request = {
        'businessInfo': {'corpType': CORP_TYPE}, 'filingInfo': {'filingTypes': [{'filingTypeCode': SEARCH_FILING_CODE}]}
    }
    pay_response = requests.post('{}/payment-requests'.format(config.PAY_API_URL), json=request,
                                 headers={
                                     'Authorization': '{} {}'.format(auth_header.scheme, auth_header.credentials),
                                     'Account-Id': account_id
                                 })

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

    return pay_response.json()


def get_payment(api_payment: dict = Depends(create_payment_request)):
    return schemas.payment.Payment(id=api_payment['id'], status=api_payment['statusCode'],
                                   method=api_payment['paymentMethod'])
