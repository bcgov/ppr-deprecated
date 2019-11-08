import os

import sqlalchemy
import sqlalchemy.orm

DB_PASSWORD = os.getenv('DB_PASSWORD')
if not DB_PASSWORD:
    raise Exception('DB_PASSWORD environment variable is required')

DATABASE_URI = 'postgresql://{user}:{password}@{host}:{port}/{name}'.format(
    user=os.getenv('DB_USERNAME', 'postgres'),
    password=DB_PASSWORD,
    host=os.getenv('DB_HOSTNAME', 'localhost'),
    port=int(os.getenv('DB_PORT', '5432')),
    name=os.getenv('DB_NAME', 'ppr')
)

engine = sqlalchemy.create_engine(DATABASE_URI)
SessionLocal = sqlalchemy.orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """
    Returns a session using yield to facilitate using it as a dependency in FastAPI.  See
    https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
