import fastapi
import sqlalchemy.orm

import models.search
import schemas.search


class SearchRepository:
    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        self.db = session

    def create_search(self, search_input: schemas.search.SearchBase):
        model = models.search.Search(criteria=search_input.criteria, type_code=search_input.type)
        self.db.add(model)
        self.db.flush()
        self.db.refresh(model)
        return model

    def get_search(self, search_id: int):
        return self.db.query(models.search.Search).filter(models.search.Search.id == search_id).first()
