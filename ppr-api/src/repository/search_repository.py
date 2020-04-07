"""Provides functionality for performing database operations on search related tables."""

import typing

import fastapi
import sqlalchemy.orm

import auth.authentication
import models.database
import models.payment
import models.search
import schemas.payment
import schemas.search


class SearchRepository:
    """Class for performing database operations on Searches."""

    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        """Initialize the repository with a session provided by Dependency Injection."""
        self.db = session

    def create_search(self, search_input: schemas.search.SearchBase, exact_matches: typing.List[str],
                      similar_matches: typing.List[str], user: auth.authentication.User,
                      payment: schemas.payment.Payment):
        """Write a search and its results to the database."""
        model = models.search.Search(criteria=search_input.criteria, type_code=search_input.type, user_id=user.user_id,
                                     account_id=user.account_id)
        model.payment = models.payment.Payment(id=payment.id, method=payment.method, status=payment.status)

        for match in exact_matches:
            model.results.append(models.search.SearchResult(registration_number=match, exact=True, selected=True))
        for match in similar_matches:
            model.results.append(models.search.SearchResult(registration_number=match, exact=False, selected=False))

        self.db.add(model)
        self.db.flush()
        self.db.refresh(model)
        return model

    def get_search(self, search_id: int):
        """Retrieve a search from the database."""
        return self.db.query(models.search.Search).filter(models.search.Search.id == search_id).first()
