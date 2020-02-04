"""create financing statement party tables

Revision ID: b4ee1da81531
Revises: 34af2f12a9ae
Create Date: 2020-01-31 14:14:31.169902

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b4ee1da81531'
down_revision = '34af2f12a9ae'
branch_labels = None
depends_on = None


def upgrade():
    party_type_table = op.create_table(
        'party_type',
        sa.Column('code', sa.CHAR(length=2), primary_key=True),
        sa.Column('description', postgresql.TEXT, nullable=False)
    )

    op.bulk_insert(party_type_table, [
        {'code': 'DE', 'description': 'Debtor'},
        {'code': 'SP', 'description': 'Secured Party'},
        {'code': 'RP', 'description': 'Registering Party'}
    ])

    op.create_table(
        'client',
        sa.Column('code', sa.BigInteger, primary_key=True),
        sa.Column('user_id', sa.String(length=8)),
        sa.Column('last_update_timestamp', sa.DateTime, server_default=sa.text('NOW()')),
        sa.Column('addr_id', sa.BigInteger, sa.ForeignKey('address.addr_id')),
        sa.Column('bc_online_account', sa.BigInteger),
        sa.Column('history_count', sa.BigInteger),
        sa.Column('branch_count', sa.BigInteger),
        sa.Column('contact_name', postgresql.TEXT),
        sa.Column('area_code', sa.String(length=3)),
        sa.Column('phone_number', sa.String(length=7)),
        sa.Column('email_address', sa.String(length=255))
    )

    op.create_table(
        'fs_party',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('addr_id', sa.BigInteger, sa.ForeignKey('address.addr_id')),
        sa.Column('party_type_cd', sa.CHAR(length=2), sa.ForeignKey('party_type.code'), nullable=False),
        sa.Column('base_reg_num', sa.String(length=10), sa.ForeignKey('financing_statement.reg_number')),
        sa.Column('reg_number_start', sa.String(length=10), sa.ForeignKey('registration.reg_number'), nullable=False),
        sa.Column('reg_number_end', sa.String(length=10), sa.ForeignKey('registration.reg_number')),
        sa.Column('email_addr', sa.String(length=255)),
        sa.Column('bus_company_num', sa.String(length=10)),
        sa.Column('business_name', postgresql.TEXT),
        sa.Column('code', sa.BigInteger, sa.ForeignKey('client.code')),
        sa.Column('last_name', postgresql.TEXT),
        sa.Column('first_name', postgresql.TEXT),
        sa.Column('middle_name', postgresql.TEXT)
    )


def downgrade():
    op.drop_table('fs_party')
    op.drop_table('client')
    op.drop_table('party_type')
