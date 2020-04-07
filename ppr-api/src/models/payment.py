"""Module for database models encapsulating payments."""

import sqlalchemy

from .database import BaseORM


class Payment(BaseORM):
    """Represents the database structure of a payment."""

    __tablename__ = 'payment'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    status = sqlalchemy.Column(sqlalchemy.String)
    method = sqlalchemy.Column(sqlalchemy.String)
