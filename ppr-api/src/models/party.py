"""Module for database models encapsulating party related tables."""

import sqlalchemy
import sqlalchemy.orm

import schemas.party

from .database import BaseORM


class Party(BaseORM):
    """Represents the database structure of all types of parties."""

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

    def as_schema(self):
        """Convert a party to its API Schema representation."""
        person_name = schemas.party.IndividualName(
            first=self.first_name, middle=self.middle_name, last=self.last_name
        ) if self.last_name else None
        base_args = {
            'businessName': self.business_name,
            'personName': person_name,
            'address': self.address.as_schema() if self.address else None
        }

        if self.type_code in [schemas.party.PartyType.REGISTERING.value, schemas.party.PartyType.SECURED.value]:
            return schemas.party.Party(**base_args)
        else:  # self.type_code == schemas.party.PartyType.DEBTOR.value
            return schemas.party.Debtor(birthdate=self.birthdate, **base_args)


class Address(BaseORM):
    """Represents the database structure of an address."""

    __tablename__ = 'address'

    id = sqlalchemy.Column('addr_id', sqlalchemy.BigInteger, primary_key=True)
    line1 = sqlalchemy.Column('addr_line_1', sqlalchemy.String)
    line2 = sqlalchemy.Column('addr_line_2', sqlalchemy.String)

    city = sqlalchemy.Column(sqlalchemy.String)
    region = sqlalchemy.Column('province', sqlalchemy.CHAR(length=2))
    country = sqlalchemy.Column('country_type_cd', sqlalchemy.CHAR(length=2))
    postal_code = sqlalchemy.Column('postal_cd', sqlalchemy.String)

    def as_schema(self):
        """Convert an address to its API Schema representation."""
        return schemas.party.Address(
            street=self.line1, streetAdditional=self.line2, city=self.city, region=self.region, country=self.country,
            postalCode=self.postal_code
        )
