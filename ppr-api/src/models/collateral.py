import sqlalchemy

from .database import BaseORM
import schemas.collateral


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

    def as_schema(self):
        return schemas.collateral.GeneralCollateral(description=self.description)


class VehicleCollateral(BaseORM):
    __tablename__ = 'vehicle'

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    base_registration_number = sqlalchemy.Column('base_reg_number', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey('financing_statement.reg_number'))
    starting_registration_number = sqlalchemy.Column('reg_number_start', sqlalchemy.String(length=10),
                                                     sqlalchemy.ForeignKey('registration.reg_number'))
    ending_registration_number = sqlalchemy.Column('reg_number_end', sqlalchemy.String(length=10),
                                                   sqlalchemy.ForeignKey('registration.reg_number'))
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
