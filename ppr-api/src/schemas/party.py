"""Provides classes that represent parties and addresses in the API contract."""

import datetime
import enum

import pydantic


class PartyType(enum.Enum):
    """An enumeration of the allowable party types."""

    REGISTERING = 'RP'
    SECURED = 'SP'
    DEBTOR = 'DE'


class IndividualName(pydantic.BaseModel):  # pylint:disable=no-member
    """The API representation of an individuals name."""

    first: str
    middle: str = None
    last: str


class Address(pydantic.BaseModel):  # pylint:disable=no-member
    """The API representation of an address."""

    street: str
    streetAdditional: str = None
    city: str
    region: str = None
    country: str
    postalCode: str


class Party(pydantic.BaseModel):  # pylint:disable=no-member
    """The common attributes for the API representation of a party."""

    personName: IndividualName = None
    businessName: str = None
    address: Address = None


class Debtor(Party):
    """The API representation of a debtor."""

    birthdate: datetime.date = None
