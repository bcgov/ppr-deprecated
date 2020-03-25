import datetime
import enum
import typing

import pydantic

import schemas.collateral
import schemas.party


class RegistrationType(enum.Enum):
    SECURITY_AGREEMENT = 'SA'             # PPSA Security Agreement
    REPAIRERS_LIEN = 'RL'                 # Repairer's Lien
    MFD_HOME_SEPARATION_AGREEMENT = 'FR'  # Marriage/Separation Agreement affecting Mfd. Home under Family Law Act
    MFD_HOME_LAND_TAX_DEFERMENT = 'LT'    # Land Tax Deferment Lien on a Manufactured Home
    MFD_HOME_TAX_LIEN = 'MH'              # Tax Lien under S.27/28 of the Manufactured Home Act
    SALE_OF_GOODS_ACT_POSSESSION = 'SG'   # Possession under S.30 of the Sale of Goods Act
    FORESTRY_CONTRACTOR_LIEN = 'FL'       # FORESTRY - Contractor Lien
    FORESTRY_CONTRACTOR_CHARGE = 'FA'     # FORESTRY - Contractor Charge
    FORESTRY_SUBCONTRACTOR_CHARGE = 'FS'  # FORESTRY - Sub-contractor Charge
    MISCELLANEOUS_REGISTRATION = 'MR'     # Miscellaneous Registration


class FinancingStatementBase(pydantic.BaseModel):  # pylint:disable=no-member
    type: str
    lifeYears: int = None
    lifeInfinite: bool = None
    registeringParty: schemas.party.Party = None
    securedParties: typing.List[schemas.party.Party]
    debtors: typing.List[schemas.party.Debtor]
    vehicleCollateral: typing.List[schemas.collateral.VehicleCollateral]
    generalCollateral: typing.List[schemas.collateral.GeneralCollateral]

    @pydantic.root_validator
    def validate_life(cls, values):  # pylint:disable=no-self-argument # noqa: N805
        years = values.get('lifeYears')
        infinite = values.get('lifeInfinite')

        if bool(infinite) != bool(years is None):
            raise ValueError('Either lifeYears must have a value or infiniteYears must be true')
        if not infinite:
            if years < 1 or years > 25:
                raise ValueError('lifeYears must be in the range 1-25')

        return values


class FinancingStatement(FinancingStatementBase):
    baseRegistrationNumber: str
    documentId: str = None
    registrationDateTime: datetime.datetime = None
    expiryDate: datetime.date = None

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
