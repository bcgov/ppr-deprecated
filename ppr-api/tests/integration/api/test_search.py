from starlette.testclient import TestClient

import main
import models.database
import models.search

client = TestClient(main.app)


def test_read_search():
    search_rec = create_test_search_record('REGISTRATION_NUMBER', {'value': '1234567'})

    rv = client.get('/searches/{}'.format(search_rec.id))
    assert rv.status_code == 200
    search = rv.json()
    assert search['id'] == search_rec.id
    assert search['type'] == 'REGISTRATION_NUMBER'
    assert search['criteria'] == {'value': '1234567'}
    assert search['searchDateTime'] == search_rec.creation_date_time.isoformat(timespec='seconds')


def test_create_registration_number_search():
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': '987654Z'}}

    rv = client.post('/searches', json=search_input)

    assert rv.status_code == 201
    body = rv.json()
    assert body['type'] == 'REGISTRATION_NUMBER'
    assert body['criteria'] == {'value': '987654Z'}
    result_id = body['id']
    assert result_id > 0

    stored = retrieve_search_record(result_id)
    assert stored
    assert stored.type_code == 'REGISTRATION_NUMBER'
    assert stored.criteria == {'value': '987654Z'}
    assert body['searchDateTime'] == stored.creation_date_time.isoformat(timespec='seconds')


def test_create_search_with_exact_match():
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': '987654Z'}}

    rv = client.post('/searches', json=search_input)

    body = rv.json()
    search_id = body['id']

    search_results = retrieve_search_result_records(search_id)
    assert len(search_results) == 1
    search_result = search_results[0]
    assert search_result.registration_number == '987654Z'
    assert search_result.exact
    assert search_result.selected


def create_test_search_record(type_code: str, criteria: dict):
    db = models.database.SessionLocal()
    try:
        search_rec = models.search.Search(type_code=type_code, criteria=criteria)
        db.add(search_rec)
        db.commit()
        db.refresh(search_rec)
        return search_rec
    finally:
        db.close()


def retrieve_search_record(search_id: int):
    db = models.database.SessionLocal()
    try:
        return db.query(models.search.Search).get(search_id)
    finally:
        db.close()


def retrieve_search_result_records(search_id: int):
    db = models.database.SessionLocal()
    try:
        return db.query(models.search.SearchResult).filter(models.search.SearchResult.search_id == search_id).all()
    finally:
        db.close()
