"""Create foreign key relationship between search_result and registration

Revision ID: 947ffeeeda60
Revises: 1461b03c20de
Create Date: 2020-01-24 16:07:20.288676

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '947ffeeeda60'
down_revision = 'fc3c53132a9b'
branch_labels = None
depends_on = None


def upgrade():
    # Remove orphaned search_result rows (don't have a valid registration_number)
    op.execute('DELETE FROM search_result sr WHERE NOT EXISTS '
               '(SELECT 1 FROM registration r WHERE r.reg_number = sr.registration_number)')

    op.create_foreign_key('search_result_registration_fk', 'search_result', 'registration', ['registration_number'],
                          ['reg_number'])


def downgrade():
    op.drop_constraint('search_result_registration_fk', 'search_result')
