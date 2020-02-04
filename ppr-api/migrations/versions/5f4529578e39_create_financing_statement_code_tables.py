"""Create financing statement_code_tables

Revision ID: 5f4529578e39
Revises: 1461b03c20de
Create Date: 2020-01-27 10:21:47.141620

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '5f4529578e39'
down_revision = '1461b03c20de'
branch_labels = None
depends_on = None


def upgrade():
    registration_type_table = op.create_table(
        'registration_type',
        sa.Column('reg_type_cd', sa.CHAR(length=2), primary_key=True),
        sa.Column('description', postgresql.TEXT, nullable=False)
    )

    op.bulk_insert(registration_type_table, [
        {'reg_type_cd': 'SA', 'description': 'PPSA Security Agreement'},
        {'reg_type_cd': 'RL', 'description': "Repairer's Lien"},
        {'reg_type_cd': 'FR',
         'description': 'Marriage/Separation Agreement affecting Manufactured Home under Family Law Act'},
        {'reg_type_cd': 'LT', 'description': 'Land Tax Deferment Lien on a Manufactured Home'},
        {'reg_type_cd': 'MH', 'description': 'Tax Lien under S.27/28 of the Manufactured Home Act'},
        {'reg_type_cd': 'SG', 'description': 'Possession under S.30 of the Sale of Goods Act'},
        {'reg_type_cd': 'FL', 'description': 'FORESTRY - Contractor Lien'},
        {'reg_type_cd': 'FA', 'description': 'FORESTRY - Contractor Charge'},
        {'reg_type_cd': 'FS', 'description': 'FORESTRY - Sub-contractor Charge'},
        {'reg_type_cd': 'MR', 'description': 'Miscellaneous Registration'}
    ])

    registration_change_type_table = op.create_table(
        'registration_change_type',
        sa.Column('change_type_cd', sa.CHAR(length=2), primary_key=True),
        sa.Column('description', postgresql.TEXT, nullable=False)
    )

    op.bulk_insert(registration_change_type_table, [
        {'change_type_cd': 'AC', 'description': 'Addition of Collateral'},
        {'change_type_cd': 'DR', 'description': 'Debtor Release'},
        {'change_type_cd': 'DT', 'description': 'Debtor Transfer'},
        {'change_type_cd': 'PD', 'description': 'Partial Discharge'},
        {'change_type_cd': 'ST', 'description': 'Secured Party Transfer'},
        {'change_type_cd': 'SU', 'description': 'Substitution of Collateral'}
    ])

    crown_charge_type_table = op.create_table(
        'crown_charge_type',
        sa.Column('crown_charge_type_cd', sa.CHAR(length=2), primary_key=True),
        sa.Column('description', postgresql.TEXT, nullable=False)
    )

    op.bulk_insert(crown_charge_type_table, [
        {'crown_charge_type_cd': 'SS', 'description': 'Social Service Tax'},
        {'crown_charge_type_cd': 'IP', 'description': 'Insurance Premium Tax'},
        {'crown_charge_type_cd': 'MR', 'description': 'Mineral Resource Tax'},
        {'crown_charge_type_cd': 'PG', 'description': 'Petroleum & Natural Gas'},
        {'crown_charge_type_cd': 'CC', 'description': 'Corporation Capital Tax'},
        {'crown_charge_type_cd': 'ET', 'description': 'Excise Tax'},
        {'crown_charge_type_cd': 'FO', 'description': 'Forest'},
        {'crown_charge_type_cd': 'LO', 'description': 'Logging Tax'},
        {'crown_charge_type_cd': 'CT', 'description': 'Carbon Tax'},
        {'crown_charge_type_cd': 'RA', 'description': 'Rural Property Tax'},
        {'crown_charge_type_cd': 'PS', 'description': 'Provincial Sales Tax'},
        {'crown_charge_type_cd': 'DP', 'description': 'Consumption Tax and Transition Act'},
        {'crown_charge_type_cd': 'HR', 'description': 'Hotel Room Tax'},
        {'crown_charge_type_cd': 'MI', 'description': 'Mining Tax'},
        {'crown_charge_type_cd': 'IT', 'description': 'Income Tax'},
        {'crown_charge_type_cd': 'FT', 'description': 'Motor Fuel Tax'},
        {'crown_charge_type_cd': 'WL', 'description': 'Lien for Unpaid Wages'},
        {'crown_charge_type_cd': 'PN', 'description': 'Proceeds of Crime Notice'},
        {'crown_charge_type_cd': 'HN', 'description': 'Heritage Conservation Notice'},
        {'crown_charge_type_cd': 'MH', 'description': 'Manufactured Home Notice'},
        {'crown_charge_type_cd': 'ML', 'description': 'Maintenance Lien'}
    ])


def downgrade():
    op.drop_table('registration_change_type')
    op.drop_table('registration_type')
    op.drop_table('crown_charge_type')
