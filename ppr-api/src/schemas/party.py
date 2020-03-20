import datetime
import enum
import re

import pydantic


class PartyType(enum.Enum):
    REGISTERING = 'RP'
    SECURED = 'SP'
    DEBTOR = 'DE'


class IndividualName(pydantic.BaseModel):
    first: str
    middle: str = None
    last: str

    @pydantic.validator('*')
    def validate_name_fields(cls, v):  # pylint:disable=no-self-argument # noqa: N805
        assert re.match("^[a-zA-Z- ']*$", v), '"IndividualName" contains invalid character'
        return v


class Address(pydantic.BaseModel):
    street: str
    streetAdditional: str = None
    city: str
    region: str = None
    country: str
    postalCode: str


class Party(pydantic.BaseModel):
    personName: IndividualName = None
    businessName: str = None
    address: Address = None

    @pydantic.validator('businessName')
    def validate_alphanum_special(cls, v, values):  # pylint:disable=no-self-argument # noqa: N805
        if values['personName'] is not None:
            raise ValueError('Cannot have "personName" and "businessName"')
        assert re.match('^[a-zA-Z-0-9\'"&:,$%.+;/ ]*$',
                        v), '"businessName" can only contain the following special characters: &\':,$-()%.+";/ '
        return v


class Debtor(Party):
    birthdate: datetime.date = None
