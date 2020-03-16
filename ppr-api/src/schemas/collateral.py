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


class GeneralCollateral(pydantic.BaseModel):
    description: str


class VehicleCollateral(pydantic.BaseModel):
    type: str
    serial: str = None
    year: int = None
    make: str = None
    model: str = None
    manufacturedHomeRegNumber: str = None
