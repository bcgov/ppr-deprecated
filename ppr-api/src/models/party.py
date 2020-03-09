import sqlalchemy
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
    address_id = sqlalchemy.Column('addr_id', sqlalchemy.BigInteger, sqlalchemy.ForeignKey('address.addr_id'))
    business_name = sqlalchemy.Column(sqlalchemy.String)
    last_name = sqlalchemy.Column(sqlalchemy.String)
    first_name = sqlalchemy.Column(sqlalchemy.String)
    middle_name = sqlalchemy.Column(sqlalchemy.String)
    birthdate = sqlalchemy.Column(sqlalchemy.Date)

    address = sqlalchemy.orm.relationship('Address')


class Address(BaseORM):
    __tablename__ = 'address'

    id = sqlalchemy.Column('addr_id', sqlalchemy.BigInteger, primary_key=True)
    line1 = sqlalchemy.Column('addr_line_1', sqlalchemy.String)
    line2 = sqlalchemy.Column('addr_line_2', sqlalchemy.String)

    city = sqlalchemy.Column(sqlalchemy.String)
    region = sqlalchemy.Column('province', sqlalchemy.CHAR(length=2))
    country = sqlalchemy.Column('country_type_cd', sqlalchemy.CHAR(length=2))
    postal_code = sqlalchemy.Column('postal_cd', sqlalchemy.String)
