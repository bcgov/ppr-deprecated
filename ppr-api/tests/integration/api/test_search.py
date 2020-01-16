from starlette.testclient import TestClient

import main
import models.database
import models.search

client = TestClient(main.app)


def test_read_search():
    search_rec = create_user("REGISTRATION_NUMBER", {'value': '1234'})

    rv = client.get('/searches/{}'.format(search_rec.id))
    assert rv.status_code == 200
    search = rv.json()
    assert search['id'] == search_rec.id
    assert search['type'] == "REGISTRATION_NUMBER"
    assert search['criteria'] == {'value': '1234'}
    assert search['searchDateTime'] == search_rec.creation_date_time.isoformat(timespec="seconds")


def create_user(type_code: str, criteria: dict):
    db = models.database.SessionLocal()
    try:
        search_rec = models.search.Search(type_code=type_code, criteria=criteria)
        db.add(search_rec)
        db.commit()
        db.refresh(search_rec)
        return search_rec
    finally:
        db.close()
