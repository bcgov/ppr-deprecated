import datetime
import enum
import typing

from pydantic import BaseModel

import schemas.party


class RegistrationType(enum.Enum):
    SECURITY_AGREEMENT = 'SA'
    REPAIRERS_LIEN = 'RL'


class FinancingStatementBase(BaseModel):
    type: str
    years: int = None
    registeringParty: schemas.party.Party = None
    securedParties: typing.List[schemas.party.Party]
    debtors: typing.List[schemas.party.Party]
    vehicleCollateral: typing.List[dict]
    generalCollateral: typing.List[dict]


class FinancingStatement(FinancingStatementBase):
    baseRegistrationNumber: str
    documentId: str = None
    registrationDateTime: datetime.datetime = None
    expiryDate: datetime.date = None

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
