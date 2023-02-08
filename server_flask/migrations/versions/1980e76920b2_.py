"""empty message

Revision ID: 1980e76920b2
Revises: 31955f6f76dd
Create Date: 2023-02-08 15:35:31.782868

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1980e76920b2'
down_revision = '31955f6f76dd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('friend_request', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.drop_constraint('friend_request_user1_id_fkey', type_='foreignkey')
        batch_op.drop_constraint('friend_request_user2_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'user', ['user_id'], ['id'])
        batch_op.drop_column('user1_id')
        batch_op.drop_column('user2_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('friend_request', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user2_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('user1_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('friend_request_user2_id_fkey', 'user', ['user2_id'], ['id'])
        batch_op.create_foreign_key('friend_request_user1_id_fkey', 'user', ['user1_id'], ['id'])
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###
