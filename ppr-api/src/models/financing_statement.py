import sqlalchemy
import sqlalchemy.orm

import models.collateral
import models.party
from schemas.party import PartyType

from .database import BaseORM


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
    parties = sqlalchemy.orm.relationship(
        models.party.Party.__name__,
        primaryjoin='and_(FinancingStatement.registration_number==Party.base_registration_number, '
                    'Party.ending_registration_number==None)'
    )
    general_collateral = sqlalchemy.orm.relationship(
        models.collateral.GeneralCollateral.__name__,
        primaryjoin='and_(FinancingStatement.registration_number==GeneralCollateral.base_registration_number, '
                    'GeneralCollateral.ending_registration_number==None)'
    )
    vehicle_collateral = sqlalchemy.orm.relationship(
        models.collateral.VehicleCollateral.__name__,
        primaryjoin='and_(FinancingStatement.registration_number==VehicleCollateral.base_registration_number, '
                    'VehicleCollateral.ending_registration_number==None)'
    )

    def get_base_event(self):
        return next((e for e in self.events if e.registration_number == self.registration_number), None)

    def get_debtors(self):
        return list(filter(lambda p: p.type_code == PartyType.DEBTOR.value, self.parties))

    def get_registering_party(self):
        return next((p for p in self.parties if p.type_code == PartyType.REGISTERING.value), None)

    def get_secured_parties(self):
        return list(filter(lambda p: p.type_code == PartyType.SECURED.value, self.parties))


class FinancingStatementEvent(BaseORM):
    __tablename__ = 'registration'

    registration_number = sqlalchemy.Column('reg_number', sqlalchemy.String(length=10), primary_key=True)
    base_registration_number = sqlalchemy.Column('base_reg_number', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey('financing_statement.reg_number'))
    change_type_code = sqlalchemy.Column('change_type_cd', sqlalchemy.CHAR(length=2))
    registration_date = sqlalchemy.Column('reg_date', sqlalchemy.DateTime, server_default=sqlalchemy.func.now())
    description = sqlalchemy.Column(sqlalchemy.String)
    document_number = sqlalchemy.Column(sqlalchemy.String(length=8))
    user_id = sqlalchemy.Column(sqlalchemy.String(length=36))

    base_registration = sqlalchemy.orm.relationship('FinancingStatement', back_populates='events')
    starting_parties = sqlalchemy.orm.relationship(
        models.party.Party.__name__, foreign_keys='Party.starting_registration_number'
    )
    ending_parties = sqlalchemy.orm.relationship(
        models.party.Party.__name__, foreign_keys='Party.ending_registration_number'
    )
    starting_general_collateral = sqlalchemy.orm.relationship(
        models.collateral.GeneralCollateral.__name__, foreign_keys='GeneralCollateral.starting_registration_number'
    )
    ending_general_collateral = sqlalchemy.orm.relationship(
        models.collateral.GeneralCollateral.__name__, foreign_keys='GeneralCollateral.ending_registration_number'
    )
    starting_vehicle_collateral = sqlalchemy.orm.relationship(
        models.collateral.VehicleCollateral.__name__, foreign_keys='VehicleCollateral.starting_registration_number'
    )
    ending_vehicle_collateral = sqlalchemy.orm.relationship(
        models.collateral.VehicleCollateral.__name__, foreign_keys='VehicleCollateral.ending_registration_number'
    )
