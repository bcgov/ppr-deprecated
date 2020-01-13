import datetime

from pydantic import BaseModel


class SearchBase(BaseModel):
    type: str
    criteria: dict

    class Config:
        orm_mode = True
        fields = {
            'type': {'alias': 'type_code'}
        }


class Search(SearchBase):
    id: int
    searchDateTime: datetime.datetime

    class Config:
        orm_mode = True
        fields = {
            'searchDateTime': {'alias': 'creation_date_time'}
        }
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat(timespec='seconds')
        }
