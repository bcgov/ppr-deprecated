"""Add account id columns.

Revision ID: 0cd6352f62d1
Revises: a40891a0a749
Create Date: 2020-04-02 12:10:13.644635

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '0cd6352f62d1'
down_revision = 'a40891a0a749'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('financing_statement', sa.Column('account_id', sa.String(length=36)))
    op.add_column('registration', sa.Column('account_id', sa.String(length=36)))
    op.add_column('search', sa.Column('account_id', sa.String(length=36)))


def downgrade():
    op.drop_column('search', 'account_id')
    op.drop_column('registration', 'account_id')
    op.drop_column('financing_statement', 'account_id')
