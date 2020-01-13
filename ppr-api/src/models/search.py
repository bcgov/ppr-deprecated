import sqlalchemy
from sqlalchemy.dialects import postgresql
import sqlalchemy.orm

from .database import BaseORM


class Search(BaseORM):
    __tablename__ = "search"

    id = sqlalchemy.Column(sqlalchemy.BigInteger, primary_key=True)
    criteria = sqlalchemy.Column(postgresql.JSON)
    creation_date_time = sqlalchemy.Column(sqlalchemy.DateTime)
    type_code = sqlalchemy.Column('type_long_code', sqlalchemy.String(length=40),
                                  sqlalchemy.ForeignKey('search_type.long_code'))

    @staticmethod
    def get_search(db: sqlalchemy.orm.Session, search_id: int):
        return db.query(Search).filter(Search.id == search_id).first()
