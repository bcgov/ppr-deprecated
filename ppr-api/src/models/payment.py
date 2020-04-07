"""Module for database models encapsulating payments."""

import sqlalchemy

import schemas.payment

from .database import BaseORM


class Payment(BaseORM):
    """Represents the database structure of a payment."""

    __tablename__ = 'payment'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    status = sqlalchemy.Column(sqlalchemy.String)
    method = sqlalchemy.Column(sqlalchemy.String)

    def as_schema(self):
        """Convert payment details to their API Schema representation."""
        return schemas.payment.Payment(id=self.id, status=self.status, method=self.method)
