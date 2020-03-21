import pydantic


class Payment(pydantic.BaseModel):  # pylint:disable=no-member
    id: int
    status: str
    method: str

    class Config:
        orm_mode = True
