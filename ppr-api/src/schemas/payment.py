"""Provides a class that represents payments in the API contract."""

import pydantic


class Payment(pydantic.BaseModel):  # pylint:disable=no-member
    """The API representation of payment details."""

    id: int
    status: str
    method: str

    class Config:
        """pydantic configuration that allows automatic mapping from a database model class."""

        orm_mode = True
