from uuid import UUID

from pydantic import BaseModel


class SearchCriteria(BaseModel):
    baseRegistrationNumber: str = None


class SearchBase(BaseModel):
    criteria: SearchCriteria = SearchCriteria()


class Search(SearchBase):
    id: UUID = None
