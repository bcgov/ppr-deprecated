import datetime
import typing

from pydantic import BaseModel


class FinancingStatementBase(BaseModel):
    type: str
    registeringParty: dict
    securedParties: typing.List[dict]
    debtors: typing.List[dict]
    vehicleCollateral: typing.List[dict]
    generalCollateral: typing.List[dict]
    expiryDate: datetime.date


class FinancingStatement(FinancingStatementBase):
    baseRegistrationNumber: str
    documentId: str
    registrationDateTime: datetime.datetime

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
