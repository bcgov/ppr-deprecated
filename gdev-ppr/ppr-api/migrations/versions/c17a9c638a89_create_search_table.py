"""Create search table

Revision ID: c17a9c638a89
Revises:
Create Date: 2020-01-07 16:29:03.466068

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'c17a9c638a89'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'search',
        sa.Column('id', postgresql.UUID, primary_key=True),
        sa.Column('type', sa.String(length=40), nullable=False),
        sa.Column('criteria_value', postgresql.TEXT),
        sa.Column('debtor_first_name', postgresql.TEXT),
        sa.Column('debtor_second_name', postgresql.TEXT),
        sa.Column('debtor_last_name', postgresql.TEXT),
        sa.Column('creation_date_time', sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False)
    )


def downgrade():
    op.drop_table('search')
