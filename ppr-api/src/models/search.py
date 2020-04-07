"""Module for database models encapsulating search related tables."""

import sqlalchemy
import sqlalchemy.orm
from sqlalchemy.dialects import postgresql

import models.financing_statement
import models.payment
import schemas.search

from .database import BaseORM


class Search(BaseORM):
    """Represents the database structure of search metadata."""

    __tablename__ = 'search'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    criteria = sqlalchemy.Column(postgresql.JSONB)
    creation_date_time = sqlalchemy.Column(sqlalchemy.DateTime, server_default=sqlalchemy.func.now())
    type_code = sqlalchemy.Column('type_long_code', sqlalchemy.String(length=40))
    account_id = sqlalchemy.Column(sqlalchemy.String(length=36))
    user_id = sqlalchemy.Column(sqlalchemy.String(length=36))
    payment_id = sqlalchemy.Column(sqlalchemy.BigInteger, sqlalchemy.ForeignKey('payment.id'))

    results = sqlalchemy.orm.relationship('SearchResult', back_populates='search')
    payment = sqlalchemy.orm.relationship(models.payment.Payment.__name__)

    def as_schema(self):
        """Convert search meta data to its API Schema representation."""
        return schemas.search.Search(
            id=self.id, type=self.type_code, criteria=self.criteria, searchDateTime=self.creation_date_time,
            payment=self.payment.as_schema() if self.payment else None
        )


class SearchResult(BaseORM):
    """Represents the database structure for storing search results."""

    __tablename__ = 'search_result'

    search_id = sqlalchemy.Column(sqlalchemy.BigInteger, sqlalchemy.ForeignKey('search.id'), primary_key=True)
    registration_number = sqlalchemy.Column(sqlalchemy.String(length=10),
                                            sqlalchemy.ForeignKey('registration.reg_number'), primary_key=True)
    exact = sqlalchemy.Column(sqlalchemy.BOOLEAN)
    selected = sqlalchemy.Column(sqlalchemy.BOOLEAN)

    search = sqlalchemy.orm.relationship('Search', back_populates='results')
    financing_statement_event = sqlalchemy.orm.relationship(models.financing_statement.FinancingStatementEvent.__name__)

    def as_schema(self):
        """Convert a search result to its external facing schema representation."""
        return schemas.search.SearchResult(
            type=schemas.search.SearchResultType(self.exact).name,
            financingStatement=self.financing_statement_event.as_financing_statement_schema()
        )
