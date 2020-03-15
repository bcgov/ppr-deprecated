import datetime
import enum
import typing

import pydantic

import schemas.collateral
import schemas.party


class RegistrationType(enum.Enum):
    SECURITY_AGREEMENT = 'SA'
    REPAIRERS_LIEN = 'RL'


class FinancingStatementBase(pydantic.BaseModel):
    type: str
    years: int = None
    registeringParty: schemas.party.Party = None
    securedParties: typing.List[schemas.party.Party]
    debtors: typing.List[schemas.party.Debtor]
    vehicleCollateral: typing.List[schemas.collateral.VehicleCollateral]
    generalCollateral: typing.List[schemas.collateral.GeneralCollateral]

    @pydantic.validator('years', pre=True)
    def validate_years(cls, years):  # pylint:disable=no-self-argument # noqa: N805
        if not type(years) is int:
            raise TypeError('Only integers are allowed')
        if years <= 0 or years > 25:
            raise ValueError('Years can only be between 1-25.')

        return years


class FinancingStatement(FinancingStatementBase):
    baseRegistrationNumber: str
    documentId: str = None
    registrationDateTime: datetime.datetime = None
    expiryDate: datetime.date = None

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
