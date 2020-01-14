import fastapi
import sqlalchemy.orm

import models.search


class SearchRepository:
    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        self.db = session

    def get_search(self, search_id: int):
        return self.db.query(models.search.Search).filter(models.search.Search.id == search_id).first()
