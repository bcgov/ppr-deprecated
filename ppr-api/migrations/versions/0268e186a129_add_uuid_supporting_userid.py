"""add UUID supporting user_id.

Revision ID: 0268e186a129
Revises: b4ee1da81531
Create Date: 2020-02-04 10:17:48.490753

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '0268e186a129'
down_revision = 'b4ee1da81531'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('search', sa.Column('user_id', sa.String(length=36)))
    op.add_column('registration', sa.Column('user_id', sa.String(length=36)))
    op.drop_column('financing_statement', 'user_id')


def downgrade():
    op.add_column('financing_statement', sa.Column('user_id', sa.String(length=8)))
    op.drop_column('registration', 'user_id')
    op.drop_column('search', 'user_id')
