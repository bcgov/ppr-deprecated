"""Add payment relationship to registration

Revision ID: 0c2b676dd83c
Revises: 78102181c4b3
Create Date: 2020-04-06 14:12:51.241012

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '0c2b676dd83c'
down_revision = '78102181c4b3'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('registration', sa.Column('payment_id', sa.BigInteger, sa.ForeignKey('payment.id'), unique=True))


def downgrade():
    op.drop_column('registration', 'payment_id')
