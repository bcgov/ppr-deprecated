"""Create search_result table

Revision ID: 1461b03c20de
Revises: c17a9c638a89
Create Date: 2020-01-16 16:39:55.238345

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '1461b03c20de'
down_revision = 'c17a9c638a89'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'search_result',
        sa.Column('search_id', sa.BigInteger, sa.ForeignKey('search.id'), nullable=False),
        sa.Column('registration_number', sa.String(length=7), nullable=False),
        sa.Column('exact', sa.BOOLEAN, nullable=False),
        sa.Column('selected', sa.BOOLEAN, nullable=False)
    )
    op.create_primary_key('pk_search_result', 'search_result', ['search_id', 'registration_number'])


def downgrade():
    op.drop_table('search_result')
