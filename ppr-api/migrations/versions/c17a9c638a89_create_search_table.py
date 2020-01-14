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
    search_type_table = op.create_table(
        'search_type',
        sa.Column('short_code', sa.CHAR(length=2), primary_key=True),
        sa.Column('long_code', sa.String(length=40), nullable=False),
        sa.Column('description', postgresql.TEXT, nullable=False),
    )

    op.create_table(
        'search',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('type_short_code', sa.CHAR(length=2), sa.ForeignKey('search_type.short_code'), nullable=False),
        sa.Column('criteria', postgresql.JSON, nullable=False),
        sa.Column('creation_date_time', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False)
    )

    # Populate the search type code tables.  Short codes are reflective of the codes in the original PPR system,
    # while the long codes are for use in the API moving forward.
    op.bulk_insert(search_type_table, [
        {'short_code': 'AS', 'long_code': 'AIRCRAFT_DOT', 'description': 'Aircraft Airframe D.O.T. Number'},
        {'short_code': 'BS', 'long_code': 'BUSINESS_DEBTOR', 'description': 'Business Debtor Name'},
        {'short_code': 'IS', 'long_code': 'INDIVIDUAL_DEBTOR', 'description': 'Individual Debtor Name'},
        {'short_code': 'MS', 'long_code': 'MHR_NUMBER', 'description': 'Manufactured Home Registration Number'},
        {'short_code': 'RS', 'long_code': 'REGISTRATION_NUMBER', 'description': 'Registration Number'},
        {'short_code': 'SS', 'long_code': 'SERIAL', 'description': 'Serial Number'}
    ])


def downgrade():
    op.drop_table('search')
    op.drop_table('search_type')
