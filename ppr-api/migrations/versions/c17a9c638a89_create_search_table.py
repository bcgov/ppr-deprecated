"""Create search table

Revision ID: c17a9c638a89
Revises:
Create Date: 2020-01-07 16:29:03.466068

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'c17a9c638a89'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    search_type_table = op.create_table(
        'search_type',
        sa.Column('long_code', sa.String(length=40), primary_key=True),
        sa.Column('short_code', sa.CHAR(length=2), nullable=False),
        sa.Column('description', postgresql.TEXT, nullable=False),
    )

    op.create_table(
        'search',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('type_long_code', sa.String(length=40), sa.ForeignKey('search_type.long_code'), nullable=False),
        sa.Column('criteria', postgresql.JSONB, nullable=False),
        sa.Column('creation_date_time', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False)
    )

    # Populate the search type code tables.  Short codes are reflective of the codes in the original PPR system,
    # while the long codes are for use in the API moving forward.
    op.bulk_insert(search_type_table, [
        {'long_code': 'AIRCRAFT_DOT', 'short_code': 'AS', 'description': 'Aircraft Airframe D.O.T. Number'},
        {'long_code': 'BUSINESS_DEBTOR', 'short_code': 'BS', 'description': 'Business Debtor Name'},
        {'long_code': 'INDIVIDUAL_DEBTOR', 'short_code': 'IS', 'description': 'Individual Debtor Name'},
        {'long_code': 'MHR_NUMBER', 'short_code': 'MS', 'description': 'Manufactured Home Registration Number'},
        {'long_code': 'REGISTRATION_NUMBER', 'short_code': 'RS', 'description': 'Registration Number'},
        {'long_code': 'SERIAL_NUMBER', 'short_code': 'SS', 'description': 'Serial Number'}
    ])


def downgrade():
    op.drop_table('search')
    op.drop_table('search_type')
