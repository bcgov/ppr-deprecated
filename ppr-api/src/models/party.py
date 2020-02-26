import sqlalchemy
from sqlalchemy.dialects import postgresql
import sqlalchemy.orm

from .database import BaseORM


class Party(BaseORM):
    __tablename__ = 'fs_party'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    type_code = sqlalchemy.Column('party_type_cd', sqlalchemy.CHAR(length=2))
    base_registration_number = sqlalchemy.Column('base_reg_num', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey('financing_statement.reg_number'))
    starting_registration_number = sqlalchemy.Column('reg_number_start', sqlalchemy.String(length=10),
                                                     sqlalchemy.ForeignKey('registration.reg_number'))
    ending_registration_number = sqlalchemy.Column('reg_number_end', sqlalchemy.String(length=10),
                                                   sqlalchemy.ForeignKey('registration.reg_number'))
    last_name = sqlalchemy.Column(postgresql.TEXT)
    first_name = sqlalchemy.Column(postgresql.TEXT)
    middle_name = sqlalchemy.Column(postgresql.TEXT)
