import datetime
import enum

import pydantic

import schemas.financing_statement


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


class SearchBase(pydantic.BaseModel):
    type: str
    criteria: dict

    @pydantic.validator('type')
    def type_must_match_search_type(cls, search_type):  # pylint:disable=no-self-argument
        try:
            SearchType[search_type]
        except KeyError:
            raise ValueError('type must be one of: {}'.format(list(map(lambda st: st.name, SearchType))))
        return search_type

    @pydantic.validator('criteria')
    def criteria_must_match_format_for_type(cls, criteria, values):  # pylint:disable=no-self-argument
        if 'type' not in values:
            return criteria

        if values['type'] == SearchType.REGISTRATION_NUMBER.value:
            if 'value' not in criteria:
                raise ValueError('"value" is required in criteria')
            if not criteria['value'].isalnum():
                raise ValueError('"value" must be alphanumeric')
        return criteria

    class Config:
        orm_mode = True
        allow_population_by_alias = True
        fields = {
            'type': {'alias': 'type_code'}
        }


class Search(SearchBase):
    id: int
    searchDateTime: datetime.datetime

    class Config:
        orm_mode = True
        allow_population_by_alias = True
        fields = {
            'searchDateTime': {'alias': 'creation_date_time'}
        }
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }


class SearchResult(pydantic.BaseModel):
    type: str
    financingStatement: schemas.financing_statement.FinancingStatement = None

    @pydantic.validator('type')
    def type_must_match_search_result_type(cls, value):  # pylint:disable=no-self-argument
        try:
            SearchResultType[value]
        except KeyError:
            raise ValueError('type must be one of: {}'.format(list(map(lambda st: st.name, SearchResultType))))
        return value
