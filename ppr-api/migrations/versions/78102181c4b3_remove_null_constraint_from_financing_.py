"""Remove null constraint from financing_statement.life.

Revision ID: 78102181c4b3
Revises: 0cd6352f62d1
Create Date: 2020-04-02 17:50:20.516154

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '78102181c4b3'
down_revision = '0cd6352f62d1'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('financing_statement', 'life', nullable=True)


def downgrade():
    op.alter_column('financing_statement', 'life', nullable=False)
