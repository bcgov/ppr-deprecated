import datetime
import enum

import pydantic


class VehicleType(enum.Enum):
    AIRCRAFT = 'AC'
    AIRCRAFT_FRAME = 'AF'
    BOAT = 'BO'
    ELECTRIC_VEHICLE = 'EV'
    MANUFACTURED_HOME = 'MH'
    MOTOR_VEHICLE = 'MV'
    OUTBOARD_MOTOR = 'OM'
    TRAILER = 'TR'


class GeneralCollateral(pydantic.BaseModel):  # pylint:disable=no-member
    description: str
    addedDateTime: datetime.datetime = None


class VehicleCollateral(pydantic.BaseModel):  # pylint:disable=no-member
    type: str
    serial: str = None
    year: int = None
    make: str = None
    model: str = None
    manufacturedHomeRegNumber: str = None
