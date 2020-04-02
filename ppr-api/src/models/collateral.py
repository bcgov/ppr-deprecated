import itertools

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
    index = sqlalchemy.Column('gc_ind', sqlalchemy.Integer)

    @staticmethod
    def list_as_schema(general_collateral: list, events: list):
        """
        When output in the API, individual lines added for a single event need to be combined into one. This is
        primarily for the purpose of handling historical data from the legacy PPR system, but also allows the API to
        split input that too large into multiple rows.

        Parameters:
            general_collateral: The list of collateral to be converted to schema objects
            events: The event objects to reference to get the date each general collateral was added
        Returns:
            list of schemas.collateral.GeneralCollateral
        """
        def grouped_gc_to_schema(event_reg_number, gc_event_list):
            """For each starting event, the general collateral descriptions should be joined together into one"""
            event = next((e for e in events if e.registration_number == event_reg_number), None)
            sorted_collateral = sorted(gc_event_list, key=lambda e: e.index or 0)
            description = ''.join(map(lambda gc: gc.description, sorted_collateral))
            return schemas.collateral.GeneralCollateral(
                description=description, addedDateTime=event.registration_date if event else None
            )
        gc_grouped = itertools.groupby(general_collateral, key=lambda gc: gc.starting_registration_number)
        return [grouped_gc_to_schema(k, g) for k, g in gc_grouped]


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
