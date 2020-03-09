import sqlalchemy

from .database import BaseORM


class Payment(BaseORM):
    __tablename__ = 'payment'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    status = sqlalchemy.Column(sqlalchemy.String)
    method = sqlalchemy.Column(sqlalchemy.String)
