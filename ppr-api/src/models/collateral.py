import sqlalchemy

import schemas.collateral

from .database import BaseORM


FINANCING_STATEMENT_KEY = 'financing_statement.reg_number'
REGISTRATION_KEY = 'registration.reg_number'


class GeneralCollateral(BaseORM):
    __tablename__ = 'general'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    base_registration_number = sqlalchemy.Column('base_reg_number', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey(FINANCING_STATEMENT_KEY))
    starting_registration_number = sqlalchemy.Column('reg_number_start', sqlalchemy.String(length=10),
                                                     sqlalchemy.ForeignKey(REGISTRATION_KEY))
    ending_registration_number = sqlalchemy.Column('reg_number_end', sqlalchemy.String(length=10),
                                                   sqlalchemy.ForeignKey(REGISTRATION_KEY))
    description = sqlalchemy.Column(sqlalchemy.String)

    def as_schema(self):
        return schemas.collateral.GeneralCollateral(description=self.description)


class VehicleCollateral(BaseORM):
    __tablename__ = 'vehicle'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    base_registration_number = sqlalchemy.Column('base_reg_number', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey(FINANCING_STATEMENT_KEY))
    starting_registration_number = sqlalchemy.Column('reg_number_start', sqlalchemy.String(length=10),
                                                     sqlalchemy.ForeignKey(REGISTRATION_KEY))
    ending_registration_number = sqlalchemy.Column('reg_number_end', sqlalchemy.String(length=10),
                                                   sqlalchemy.ForeignKey(REGISTRATION_KEY))
    type_code = sqlalchemy.Column('vehicle_type_cd', sqlalchemy.CHAR(length=2))
    year = sqlalchemy.Column(sqlalchemy.Integer)
    make = sqlalchemy.Column(sqlalchemy.String)
    model = sqlalchemy.Column(sqlalchemy.String)
    serial_number = sqlalchemy.Column(sqlalchemy.String(length=25))
    mhr_number = sqlalchemy.Column(sqlalchemy.String(length=7))

    def as_schema(self):
        return schemas.collateral.VehicleCollateral(
            type=schemas.collateral.VehicleType(self.type_code).name, year=self.year, make=self.make, model=self.model,
            serial=self.serial_number, manufacturedHomeRegNumber=self.mhr_number
        )
