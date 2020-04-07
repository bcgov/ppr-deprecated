"""Set up SQL Alchemy to access the Patroni database."""

import sqlalchemy
import sqlalchemy.orm

import config


DATABASE_URI = 'postgresql://{user}:{password}@{host}:{port}/{name}'.format(
    user=config.DB_USERNAME,
    password=config.DB_PASSWORD,
    host=config.DB_HOSTNAME_PATRONI,
    port=config.DB_PORT_PATRONI,
    name=config.DB_NAME
)

engine = sqlalchemy.create_engine(DATABASE_URI)
SessionLocal = sqlalchemy.orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """
    Get a new session using yield to facilitate using it as a dependency in FastAPI.

    See https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as ex:
        db.rollback()
        raise ex
    finally:
        db.close()
