import enum

import pydantic


class PartyType(enum.Enum):
    REGISTERING = 'RP'
    SECURED = 'SP'
    DEBTOR = 'DE'


class IndividualName(pydantic.BaseModel):
    first: str
    middle: str = None
    last: str


class Party(pydantic.BaseModel):
    name: IndividualName
