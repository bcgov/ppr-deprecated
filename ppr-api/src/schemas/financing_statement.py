import datetime
import enum
import typing

from pydantic import BaseModel


class RegistrationType(enum.Enum):
    SECURITY_AGREEMENT = 'SA'
    REPAIRERS_LIEN = 'RL'


class FinancingStatementBase(BaseModel):
    type: str
    registeringParty: dict
    securedParties: typing.List[dict]
    debtors: typing.List[dict]
    vehicleCollateral: typing.List[dict]
    generalCollateral: typing.List[dict]
    expiryDate: datetime.date = None


class FinancingStatement(FinancingStatementBase):
    baseRegistrationNumber: str
    documentId: str
    registrationDateTime: datetime.datetime

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
