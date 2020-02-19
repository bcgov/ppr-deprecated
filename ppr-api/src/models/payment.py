import sqlalchemy
from sqlalchemy.dialects import postgresql

from .database import BaseORM


class Payment(BaseORM):
    __tablename__ = 'payment'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    status = sqlalchemy.Column(postgresql.TEXT)
    method = sqlalchemy.Column(postgresql.TEXT)
