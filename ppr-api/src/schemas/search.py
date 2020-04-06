import datetime
import enum

import pydantic

import schemas.financing_statement
import schemas.payment


class SearchType(enum.Enum):
    AIRCRAFT_DOT = 'AIRCRAFT_DOT'
    BUSINESS_DEBTOR = 'BUSINESS_DEBTOR'
    INDIVIDUAL_DEBTOR = 'INDIVIDUAL_DEBTOR'
    MHR_NUMBER = 'MHR_NUMBER'
    REGISTRATION_NUMBER = 'REGISTRATION_NUMBER'
    SERIAL_NUMBER = 'SERIAL_NUMBER'


class SearchResultType(enum.Enum):
    EXACT = True
    SIMILAR = False


class SearchBase(pydantic.BaseModel):  # pylint:disable=no-member
    type: str
    criteria: dict

    @pydantic.validator('type')
    def type_must_match_search_type(cls, search_type):  # pylint:disable=no-self-argument # noqa: N805
        try:
            SearchType[search_type]
        except KeyError:
            raise ValueError('type must be one of: {}'.format(list(map(lambda st: st.name, SearchType))))
        return search_type

    @pydantic.validator('criteria')
    def criteria_must_match_format_for_type(cls, criteria, values):  # pylint:disable=no-self-argument # noqa: N805
        if 'type' not in values:
            return criteria

        if values['type'] == SearchType.INDIVIDUAL_DEBTOR.value:
            if 'debtorName' not in criteria:
                raise ValueError('"debtorName" is required in criteria')
            elif 'last' not in criteria['debtorName']:
                raise ValueError('"last" is required in criteria.debtorName')
            elif 'first' not in criteria['debtorName']:
                raise ValueError('"first" is required in criteria.debtorName')
        elif 'value' not in criteria:
            raise ValueError('"value" is required in criteria')
        elif '%' in criteria['value']:
            raise ValueError('"%" is not permitted in criteria.value')

        return criteria

    class Config:
        orm_mode = True
        allow_population_by_alias = True
        fields = {
            'type': {'alias': 'type_code'}
        }


class Search(SearchBase):  # pylint:disable=no-member
    id: int
    searchDateTime: datetime.datetime
    payment: schemas.payment.Payment = None

    class Config:
        orm_mode = True
        allow_population_by_alias = True
        fields = {
            'searchDateTime': {'alias': 'creation_date_time'}
        }
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }


class SearchResult(pydantic.BaseModel):  # pylint:disable=no-member
    type: str
    financingStatement: schemas.financing_statement.FinancingStatement = None

    @pydantic.validator('type')
    def type_must_match_search_result_type(cls, value):  # pylint:disable=no-self-argument # noqa: N805
        try:
            SearchResultType[value]
        except KeyError:
            raise ValueError('type must be one of: {}'.format(list(map(lambda st: st.name, SearchResultType))))
        return value

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
