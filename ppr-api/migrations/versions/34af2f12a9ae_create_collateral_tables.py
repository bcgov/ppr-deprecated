"""create collateral tables

Revision ID: 34af2f12a9ae
Revises: 6411b673d98b
Create Date: 2020-01-30 07:32:26.276577

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '34af2f12a9ae'
down_revision = '6411b673d98b'
branch_labels = None
depends_on = None


def upgrade():
    vehicle_type_table = op.create_table(
        'vehicle_type',
        sa.Column('vehicle_type_cd', sa.CHAR(length=2), primary_key=True),
        sa.Column('vehicle_description', sa.String(length=30), nullable=False)
    )

    op.bulk_insert(vehicle_type_table, [
        {'vehicle_type_cd': 'MV', 'vehicle_description': 'Motor Vehicle'},
        {'vehicle_type_cd': 'MH', 'vehicle_description': 'Manufactured Home'},
        {'vehicle_type_cd': 'BO', 'vehicle_description': 'Boat'},
        {'vehicle_type_cd': 'TR', 'vehicle_description': 'Trailer'},
        {'vehicle_type_cd': 'AC', 'vehicle_description': 'Air Craft'},
        {'vehicle_type_cd': 'AF', 'vehicle_description': 'Air Craft Frame'},
        {'vehicle_type_cd': 'EV', 'vehicle_description': 'Electric Vehicle'}
    ])

    op.create_table(
        'vehicle',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('reg_number_start', sa.String(length=10), sa.ForeignKey('registration.reg_number'), nullable=False),
        sa.Column('reg_number_end', sa.String(length=10), sa.ForeignKey('registration.reg_number')),
        sa.Column('vehicle_type_cd', sa.CHAR(length=2), sa.ForeignKey('vehicle_type.vehicle_type_cd'), nullable=False),
        sa.Column('base_reg_number', sa.String(length=10), sa.ForeignKey('financing_statement.reg_number')),
        sa.Column('year', sa.BigInteger),
        sa.Column('make', postgresql.TEXT),
        sa.Column('model', postgresql.TEXT),
        sa.Column('serial_number', sa.String(length=25)),
        sa.Column('mhr_number', sa.String(length=7))
    )

    op.create_table(
        'general',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('reg_number_start', sa.String(length=10), sa.ForeignKey('registration.reg_number'), nullable=False),
        sa.Column('reg_number_end', sa.String(length=10), sa.ForeignKey('registration.reg_number')),
        sa.Column('description', postgresql.TEXT),
        sa.Column('base_reg_number', sa.String(length=10), sa.ForeignKey('financing_statement.reg_number'))
    )


def downgrade():
    op.drop_table('vehicle')
    op.drop_table('vehicle_type')
    op.drop_table('general')
