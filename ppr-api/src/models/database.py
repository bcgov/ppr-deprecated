"""
A proxy class for database access for use while we have multiple databases configured.  For the time being it will
point to the patroni configuration, but can be changed down the road when we switch to EDB.
"""

import sqlalchemy.ext.declarative

import models.patroni

DATABASE_URI = models.patroni.DATABASE_URI

BaseORM = sqlalchemy.ext.declarative.declarative_base()

get_session = models.patroni.get_session
