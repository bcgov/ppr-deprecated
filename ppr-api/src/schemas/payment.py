import pydantic


class Payment(pydantic.BaseModel):
    id: int
    status: str
    method: str

    class Config:
        orm_mode = True
