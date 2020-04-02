"""Add sequence to general collateral

Revision ID: a40891a0a749
Revises: 29a8ce790e7d
Create Date: 2020-04-02 09:58:10.019236

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = 'a40891a0a749'
down_revision = '29a8ce790e7d'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('general', sa.Column('gc_ind', sa.Integer))


def downgrade():
    op.drop_column('general', 'gc_ind')
