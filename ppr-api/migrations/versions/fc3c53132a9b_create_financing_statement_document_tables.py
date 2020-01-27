"""Create financing statement document tables

Revision ID: fc3c53132a9b
Revises: 1461b03c20de
Create Date: 2020-01-24 10:47:29.158143

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'fc3c53132a9b'
down_revision = '5f4529578e39'
branch_labels = None
depends_on = None


def upgrade():
    registration_number_sequence = sa.schema.Sequence('reg_number_seq', start=10000001)
    op.execute(sa.schema.CreateSequence(registration_number_sequence))

    op.create_table(
        'financing_statement',
        sa.Column('reg_number', sa.String(length=10), primary_key=True, nullable=False),
        sa.Column('reg_type_cd', sa.CHAR(length=2), sa.ForeignKey('registration_type.reg_type_cd'), nullable=False),
        sa.Column('status', sa.CHAR(length=1), nullable=False),
        sa.Column('life', sa.Integer, nullable=False),
        sa.Column('expiry_date', sa.Date),
        sa.Column('surrender_date', sa.Date),
        sa.Column('lien_value', sa.String(length=15)),
        sa.Column('type_claim', sa.CHAR(length=2)),
        sa.Column('crown_charge_act', sa.CHAR(length=2), sa.ForeignKey('crown_charge_type.crown_charge_type_cd')),
        sa.Column('crown_charge_other', sa.String(length=70)),
        sa.Column('trust', sa.BOOLEAN),
        sa.Column('discharged', sa.BOOLEAN),
        sa.Column('renewed', sa.BOOLEAN),
        sa.Column('ver_bypassed', sa.BOOLEAN),
        sa.Column('last_update_timestamp', sa.DateTime, server_default=sa.text('NOW()')),
        sa.Column('user_id', sa.String(length=8), nullable=False)
    )

    op.create_table(
        'registration',
        sa.Column('reg_number', sa.String(length=10), primary_key=True, nullable=False),
        sa.Column('base_reg_number', sa.String(length=10), sa.ForeignKey('financing_statement.reg_number'),
                  nullable=False),
        sa.Column('change_type_cd', sa.CHAR(length=2), sa.ForeignKey('registration_change_type.change_type_cd'),
                  nullable=True),
        sa.Column('reg_date', sa.DateTime, server_default=sa.text('NOW()'), nullable=False),
        sa.Column('life', sa.Integer, nullable=False),
        sa.Column('crown_charge_act', sa.CHAR(length=2), sa.ForeignKey('crown_charge_type.crown_charge_type_cd')),
        sa.Column('crown_charge_other', sa.String(length=70)),
        sa.Column('description', postgresql.TEXT),
        sa.Column('document_number', sa.CHAR(length=8), nullable=False),
        sa.Column('ims_billing_number', sa.String(length=8)),
        sa.Column('ims_user_id', sa.String(length=32))
    )


def downgrade():
    op.drop_table('registration')
    op.drop_table('financing_statement')
    op.execute(sa.schema.DropSequence(sa.schema.Sequence('reg_number_seq')))
