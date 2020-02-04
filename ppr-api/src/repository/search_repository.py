import typing

import fastapi
import sqlalchemy.orm

import auth.authentication
import models.search
import schemas.search


class SearchRepository:
    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        self.db = session

    def create_search(self, search_input: schemas.search.SearchBase, exact_matches: typing.List[str],
                      similar_matches: typing.List[str], user: auth.authentication.User):
        model = models.search.Search(criteria=search_input.criteria, type_code=search_input.type, user_id=user.user_id)

        for match in exact_matches:
            model.results.append(models.search.SearchResult(registration_number=match, exact=True, selected=True))
        for match in similar_matches:
            model.results.append(models.search.SearchResult(registration_number=match, exact=False, selected=False))

        self.db.add(model)
        self.db.flush()
        self.db.refresh(model)
        return model

    def get_search(self, search_id: int):
        return self.db.query(models.search.Search).filter(models.search.Search.id == search_id).first()
