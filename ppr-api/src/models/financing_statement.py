import sqlalchemy
from sqlalchemy.dialects import postgresql
import sqlalchemy.orm

from .database import BaseORM
import models.party


class FinancingStatement(BaseORM):
    __tablename__ = 'financing_statement'

    registration_number = sqlalchemy.Column('reg_number', sqlalchemy.String(length=10), primary_key=True)
    registration_type_code = sqlalchemy.Column('reg_type_cd', sqlalchemy.CHAR(length=2))
    status = sqlalchemy.Column(sqlalchemy.CHAR(length=1))
    life_in_years = sqlalchemy.Column('life', sqlalchemy.Integer)
    expiry_date = sqlalchemy.Column(sqlalchemy.Date)
    discharged = sqlalchemy.Column(sqlalchemy.BOOLEAN)
    last_updated = sqlalchemy.Column('last_update_timestamp', sqlalchemy.DateTime, server_default=sqlalchemy.func.now(),
                                     onupdate=sqlalchemy.func.now())

    events = sqlalchemy.orm.relationship('FinancingStatementEvent', back_populates='base_registration')
    parties = sqlalchemy.orm.relationship(models.party.Party.__name__)


class FinancingStatementEvent(BaseORM):
    __tablename__ = 'registration'

    registration_number = sqlalchemy.Column('reg_number', sqlalchemy.String(length=10), primary_key=True)
    base_registration_number = sqlalchemy.Column('base_reg_number', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey('financing_statement.reg_number'))
    change_type_code = sqlalchemy.Column('change_type_cd', sqlalchemy.CHAR(length=2))
    registration_date = sqlalchemy.Column('reg_date', sqlalchemy.DateTime, server_default=sqlalchemy.func.now())
    description = sqlalchemy.Column(postgresql.TEXT)
    document_number = sqlalchemy.Column(sqlalchemy.String(length=8))
    user_id = sqlalchemy.Column(sqlalchemy.String(length=36))

    base_registration = sqlalchemy.orm.relationship('FinancingStatement', back_populates='events')
    starting_parties = sqlalchemy.orm.relationship(models.party.Party.__name__,
                                                   foreign_keys='Party.starting_registration_number')
