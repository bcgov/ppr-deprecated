"""Provides classes that represent collateral in the API contract."""

import datetime
import enum

import pydantic


class VehicleType(enum.Enum):
    """An enumeration of the allowable vehicle types."""

    AIRCRAFT = 'AC'
    AIRCRAFT_FRAME = 'AF'
    BOAT = 'BO'
    ELECTRIC_VEHICLE = 'EV'
    MANUFACTURED_HOME = 'MH'
    MOTOR_VEHICLE = 'MV'
    OUTBOARD_MOTOR = 'OM'
    TRAILER = 'TR'


class GeneralCollateral(pydantic.BaseModel):  # pylint:disable=no-member
    """The API representation of a general collateral item."""

    description: str
    addedDateTime: datetime.datetime = None


class VehicleCollateral(pydantic.BaseModel):  # pylint:disable=no-member
    """The API representation of a vehicle collateral item."""

    type: str
    serial: str = None
    year: int = None
    make: str = None
    model: str = None
    manufacturedHomeRegNumber: str = None
