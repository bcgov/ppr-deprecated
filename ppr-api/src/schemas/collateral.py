import enum

import pydantic


class VehicleType(enum.Enum):
    BOAT = 'BO'
    ELECTRIC_VEHICLE = 'EV'
    MANUFACTURED_HOME = 'MH'
    MOTOR_VEHICLE = 'MV'
    TRAILER = 'TR'
    # TODO values below require some clarification, question is out to Bob to help
    AIRFRAME_REGISTERED_IN_CANADA = 'AC'
    AIRFRAME_NOT_REGISTERED_IN_CANADA = 'AF'
    OUTBOARD_MOTOR = 'OM'


class GeneralCollateral(pydantic.BaseModel):
    description: str


class VehicleCollateral(pydantic.BaseModel):
    type: str
    serial: str = None
    year: int = None
    make: str = None
    model: str = None
    manufacturedHomeRegNumber: str = None
