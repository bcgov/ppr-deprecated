"""Add Outboard Motor vehicle type

Revision ID: 29a8ce790e7d
Revises: 324c3ef5f86c
Create Date: 2020-03-16 14:40:19.818029

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '29a8ce790e7d'
down_revision = '324c3ef5f86c'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("INSERT INTO vehicle_type (vehicle_type_cd, vehicle_description) VALUES ('OM', 'Outboard Motor')")


def downgrade():
    op.execute("DELETE FROM vehicle_type WHERE vehicle_type_cd = 'OM'")
