import sqlalchemy
from sqlalchemy.dialects import postgresql
import sqlalchemy.orm

from .database import BaseORM


class Search(BaseORM):
    __tablename__ = 'search'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    criteria = sqlalchemy.Column(postgresql.JSONB)
    creation_date_time = sqlalchemy.Column(sqlalchemy.DateTime, server_default=sqlalchemy.func.now())
    type_code = sqlalchemy.Column('type_long_code', sqlalchemy.String(length=40))

    results = sqlalchemy.orm.relationship('SearchResult', back_populates='search')


class SearchResult(BaseORM):
    __tablename__ = 'search_result'

    search_id = sqlalchemy.Column(sqlalchemy.BigInteger, sqlalchemy.ForeignKey('search.id'), primary_key=True)
    registration_number = sqlalchemy.Column(sqlalchemy.String(length=7),
                                            sqlalchemy.ForeignKey('registration.reg_number'), primary_key=True)
    exact = sqlalchemy.Column(sqlalchemy.BOOLEAN)
    selected = sqlalchemy.Column(sqlalchemy.BOOLEAN)

    search = sqlalchemy.orm.relationship('Search', back_populates='results')
    financing_statement_event = sqlalchemy.orm.relationship('FinancingStatementEvent')
