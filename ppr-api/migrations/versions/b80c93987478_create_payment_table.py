"""Create payment table

Revision ID: b80c93987478
Revises: 0268e186a129
Create Date: 2020-02-18 15:23:32.597997

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'b80c93987478'
down_revision = '0268e186a129'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'payment',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('status', postgresql.TEXT, nullable=False),
        sa.Column('method', postgresql.TEXT, nullable=False)
    )

    op.add_column('search', sa.Column('payment_id', sa.BigInteger, sa.ForeignKey('payment.id'), unique=True))


def downgrade():
    op.drop_column('search', 'payment_id')
    op.drop_table('payment')
