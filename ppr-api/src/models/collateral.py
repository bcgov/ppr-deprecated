import sqlalchemy

from .database import BaseORM


class GeneralCollateral(BaseORM):
    __tablename__ = 'general'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    base_registration_number = sqlalchemy.Column('base_reg_number', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey('financing_statement.reg_number'))
    starting_registration_number = sqlalchemy.Column('reg_number_start', sqlalchemy.String(length=10),
                                                     sqlalchemy.ForeignKey('registration.reg_number'))
    ending_registration_number = sqlalchemy.Column('reg_number_end', sqlalchemy.String(length=10),
                                                   sqlalchemy.ForeignKey('registration.reg_number'))
    description = sqlalchemy.Column(sqlalchemy.String)
