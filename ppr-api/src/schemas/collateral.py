import pydantic


class GeneralCollateral(pydantic.BaseModel):
    description: str
