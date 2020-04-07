"""Module for database models encapsulating the core financing statement tables."""

import datedelta
import sqlalchemy
import sqlalchemy.orm

import models.collateral
import models.party
import models.payment
import schemas.financing_statement
import utils.datetime
from schemas.financing_statement import RegistrationType
from schemas.party import PartyType

from .database import BaseORM


class FinancingStatement(BaseORM):
    """Represents the database structure of a Financing Statement."""

    __tablename__ = 'financing_statement'

    registration_number = sqlalchemy.Column('reg_number', sqlalchemy.String(length=10), primary_key=True)
    registration_type_code = sqlalchemy.Column('reg_type_cd', sqlalchemy.CHAR(length=2))
    status = sqlalchemy.Column(sqlalchemy.CHAR(length=1))
    life_in_years = sqlalchemy.Column('life', sqlalchemy.Integer)
    expiry_date = sqlalchemy.Column(sqlalchemy.Date)
    discharged = sqlalchemy.Column(sqlalchemy.BOOLEAN)
    account_id = sqlalchemy.Column(sqlalchemy.String(length=36))  # Designates ownership of the financing statement
    last_updated = sqlalchemy.Column('last_update_timestamp', sqlalchemy.DateTime, server_default=sqlalchemy.func.now(),
                                     onupdate=sqlalchemy.func.now())
    trust_indenture = sqlalchemy.Column('trust', sqlalchemy.BOOLEAN)
    surrender_date = sqlalchemy.Column(sqlalchemy.Date)
    lien_amount = sqlalchemy.Column('lien_value', sqlalchemy.String(length=15))

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

    def as_schema(self):
        """Convert a Financing Statement to its API Schema representation."""
        base_event = self.get_base_event()
        reg_date = base_event.registration_date if base_event else None
        payment_schema = base_event.payment.as_schema() if base_event and base_event.payment else None
        reg_party_model = self.get_registering_party()
        infinite = self.life_in_years == -1 if self.life_in_years is not None else None
        years = self.life_in_years if not infinite else None

        reg_party_schema = reg_party_model.as_schema() if reg_party_model else None
        secured_parties_schema = list(map(models.party.Party.as_schema, self.get_secured_parties()))
        debtors_schema = list(map(models.party.Party.as_schema, self.get_debtors()))
        vehicle_collateral_schema = list(map(models.collateral.VehicleCollateral.as_schema, self.vehicle_collateral))
        general_collateral_schema = models.collateral.GeneralCollateral.list_as_schema(self.general_collateral,
                                                                                       self.events)

        return schemas.financing_statement.FinancingStatement(
            baseRegistrationNumber=self.registration_number, registrationDateTime=reg_date, expiryDate=self.expiry_date,
            lifeYears=years, lifeInfinite=infinite, type=RegistrationType(self.registration_type_code).name,
            trustIndenture=self.trust_indenture, lienAmount=self.lien_amount, surrenderDate=self.surrender_date,
            registeringParty=reg_party_schema, securedParties=secured_parties_schema, debtors=debtors_schema,
            vehicleCollateral=vehicle_collateral_schema, generalCollateral=general_collateral_schema,
            payment=payment_schema
        )

    def get_base_event(self):
        """Find the event created for the Base Registration."""
        return next((e for e in self.events if e.registration_number == self.registration_number), None)

    def get_debtors(self):
        """Filter the parties to get only the debtors."""
        return list(filter(lambda p: p.type_code == PartyType.DEBTOR.value, self.parties))

    def get_registering_party(self):
        """Find the registering party from the list of active parties."""
        return next((p for p in self.parties if p.type_code == PartyType.REGISTERING.value), None)

    def get_secured_parties(self):
        """Filter the parties to get only the secured parties."""
        return list(filter(lambda p: p.type_code == PartyType.SECURED.value, self.parties))


class FinancingStatementEvent(BaseORM):
    """Represents the database structure of a Financing Statement Event (aka Registration)."""

    __tablename__ = 'registration'

    registration_number = sqlalchemy.Column('reg_number', sqlalchemy.String(length=10), primary_key=True)
    base_registration_number = sqlalchemy.Column('base_reg_number', sqlalchemy.String(length=10),
                                                 sqlalchemy.ForeignKey('financing_statement.reg_number'))
    change_type_code = sqlalchemy.Column('change_type_cd', sqlalchemy.CHAR(length=2))
    registration_date = sqlalchemy.Column('reg_date', sqlalchemy.DateTime, server_default=sqlalchemy.func.now())
    description = sqlalchemy.Column(sqlalchemy.String)
    document_number = sqlalchemy.Column(sqlalchemy.String(length=8))
    account_id = sqlalchemy.Column(sqlalchemy.String(length=36))
    user_id = sqlalchemy.Column(sqlalchemy.String(length=36))
    life_in_years = sqlalchemy.Column('life', sqlalchemy.Integer)
    payment_id = sqlalchemy.Column(sqlalchemy.BigInteger, sqlalchemy.ForeignKey('payment.id'))

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

    payment = sqlalchemy.orm.relationship(models.payment.Payment.__name__)

    def as_financing_statement_schema(self):
        """
        Rebuild the state of a financing statement up to the point of this event.

        Provide a Financing Statement result that represents the state as it was when that event was applied. This
        is done by applying events in order and ignoring events that occur after the one provided.

            Returns:
                schemas.financing_statement.FinancingStatement
        """
        fs_model = self.base_registration
        is_repairers_lien = fs_model.registration_type_code == RegistrationType.REPAIRERS_LIEN.value
        target_events = sorted(filter(lambda e: e.registration_date <= self.registration_date, fs_model.events),
                               key=lambda e: e.registration_date)
        infinite = None
        years = 0
        expiry = utils.datetime.to_date_pacific(fs_model.get_base_event().registration_date)
        if is_repairers_lien:
            expiry += datedelta.datedelta(days=180)
            years = None

        parties_snapshot = []
        general_coll_snapshot = []
        vehicle_coll_snapshot = []
        for applied_event in target_events:
            # remove entities that end with the new event, and add those that were introduced
            parties_snapshot = filter_ending_items(applied_event.registration_number, parties_snapshot)
            parties_snapshot.extend(applied_event.starting_parties)
            general_coll_snapshot = filter_ending_items(applied_event.registration_number, general_coll_snapshot)
            general_coll_snapshot.extend(applied_event.starting_general_collateral)
            vehicle_coll_snapshot = filter_ending_items(applied_event.registration_number, vehicle_coll_snapshot)
            vehicle_coll_snapshot.extend(applied_event.starting_vehicle_collateral)

            # TODO ppr#708 Need to detect Repairer's Lien renewals to increase expiry date by another 180 days
            # Apply the life of each event to capture the combined expiry. This includes renewals.
            if not infinite and not is_repairers_lien:
                if applied_event.life_in_years == -1:
                    infinite = True
                    years = None
                    expiry = None
                elif applied_event.life_in_years and applied_event.life_in_years > 0:
                    years += applied_event.life_in_years
                    expiry += datedelta.datedelta(years=applied_event.life_in_years)
                    infinite = False

        reg_party_model = next((p for p in parties_snapshot if p.type_code == PartyType.REGISTERING.value), None)
        reg_party_schema = reg_party_model.as_schema() if reg_party_model else None
        secured_parties_model = filter(lambda p: p.type_code == PartyType.SECURED.value, parties_snapshot)
        secured_parties_schema = list(map(models.party.Party.as_schema, secured_parties_model))
        debtors_model = filter(lambda p: p.type_code == PartyType.DEBTOR.value, parties_snapshot)
        debtors_schema = list(map(models.party.Party.as_schema, debtors_model))
        vehicle_coll_schema = list(map(models.collateral.VehicleCollateral.as_schema, vehicle_coll_snapshot))
        general_coll_schema = models.collateral.GeneralCollateral.list_as_schema(general_coll_snapshot, target_events)

        return schemas.financing_statement.FinancingStatement(
            baseRegistrationNumber=self.base_registration_number, registrationDateTime=self.registration_date,
            documentId=self.document_number, expiryDate=expiry, lifeYears=years, lifeInfinite=infinite,
            trustIndenture=fs_model.trust_indenture, lienAmount=fs_model.lien_amount,
            surrenderDate=fs_model.surrender_date, registeringParty=reg_party_schema,
            securedParties=secured_parties_schema, debtors=debtors_schema, vehicleCollateral=vehicle_coll_schema,
            generalCollateral=general_coll_schema,
            type=schemas.financing_statement.RegistrationType(fs_model.registration_type_code).name
        )


def filter_ending_items(registration_number: str, items: list):
    """
    Get a subset of the provided list that excludes items that were removed for the specified registration number.

    :param registration_number: The registration number to filter out items for
    :param items: A list of items to be filtered.  Must have a 'ending_registration_number' attribute
    :return: The filtered list
    """
    return list(filter(lambda item: item.ending_registration_number != registration_number, items))
