"""add birthdate field to financing statement party

Revision ID: 324c3ef5f86c
Revises: b80c93987478
Create Date: 2020-03-05 10:01:58.697780

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '324c3ef5f86c'
down_revision = 'b80c93987478'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('fs_party', sa.Column('birthdate', sa.Date, nullable=True))


def downgrade():
    op.drop_column('fs_party', 'birthdate')
