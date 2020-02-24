import datetime
import enum
import typing

from pydantic import BaseModel


class RegistrationType(enum.Enum):
    SECURITY_AGREEMENT = 'SA'
    REPAIRERS_LIEN = 'RL'


class FinancingStatementBase(BaseModel):
    type: str
    years: int = None
    registeringParty: dict
    securedParties: typing.List[dict]
    debtors: typing.List[dict]
    vehicleCollateral: typing.List[dict]
    generalCollateral: typing.List[dict]


class FinancingStatement(FinancingStatementBase):
    baseRegistrationNumber: str
    documentId: str = None
    registrationDateTime: datetime.datetime
    expiryDate: datetime.date = None

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
