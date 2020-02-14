import http
import logging

from fastapi import Depends, HTTPException
from fastapi.security.http import HTTPAuthorizationCredentials
from pydantic import BaseModel
import requests

import config
import auth.authentication

logger = logging.getLogger(__name__)

# TODO This is a temporary payload to enable interaction with payments.  Replace with a coded solution base on the user.
HARDCODED_PAYLOAD = """{
    "paymentInfo": {
        "methodOfPayment": "CC"
    },
    "businessInfo": {
        "businessIdentifier": "CP0000019",
        "corpType": "CP",
        "businessName": "ABC Corp",
        "contactInfo": {
            "city": "Victoria",
            "postalCode": "V8P2P2",
            "province": "BC",
            "addressLine1": "100 Douglas Street",
            "country": "CA"
        }
    },
    "filingInfo": {
        "filingTypes": [
            {
                "filingTypeCode": "OTADD"
            }
        ]
    }
}"""


def create_payment_request(auth_header: HTTPAuthorizationCredentials = Depends(auth.authentication.bearer_scheme)):
    pay_response = requests.post('{}/payment-requests'.format(config.PAY_API_URL), json=eval(HARDCODED_PAYLOAD),
                                 headers={'Authorization': '{} {}'.format(auth_header.scheme, auth_header.credentials)})

    auth.authentication.check_auth_response(pay_response)
    if not pay_response:  # status_code is unsuccessful
        logger.error('Create Payment call failed unexpectedly with status {}.  Response body: {}'.format(
            pay_response.status_code, pay_response.text))
        raise HTTPException(status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR)

    return pay_response.json()


def get_payment(api_payment: dict = Depends(create_payment_request)):
    return Payment(id=api_payment['id'], status=api_payment['statusCode'], method=api_payment['paymentMethod'])


class Payment(BaseModel):
    id: int
    status: str
    method: str
