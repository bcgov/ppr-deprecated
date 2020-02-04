from starlette.testclient import TestClient

import main
import models.database
import models.financing_statement
import models.search
import schemas.financing_statement

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


def test_create_registration_number_search(default_current_user):
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
    assert stored.user_id == 'fake_user_id'  # Default user for integration tests
    assert body['searchDateTime'] == stored.creation_date_time.isoformat(timespec='seconds')


def test_create_search_with_exact_match():
    search_value = create_test_financing_statement().registration_number
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': search_value}}

    rv = client.post('/searches', json=search_input)

    body = rv.json()
    search_id = body['id']

    search_results = retrieve_search_result_records(search_id)
    assert len(search_results) == 1
    search_result = search_results[0]
    assert search_result.registration_number == search_value
    assert search_result.exact
    assert search_result.selected


def test_create_registration_number_search_matches_non_base_registration():
    search_value = create_test_financing_statement(2).events[1].registration_number
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': search_value}}

    rv = client.post('/searches', json=search_input)

    body = rv.json()
    search_id = body['id']

    search_results = retrieve_search_result_records(search_id)
    assert len(search_results) == 1
    search_result = search_results[0]
    assert search_result.registration_number == search_value


def test_read_singular_search_results():
    fin_stmt = create_test_financing_statement()
    matching_reg_num = fin_stmt.registration_number
    search_rec = create_test_search_record('REGISTRATION_NUMBER', {'value': matching_reg_num}, [matching_reg_num])

    rv = client.get('/searches/{}/results'.format(search_rec.id))

    assert rv.status_code == 200
    body = rv.json()
    assert isinstance(body, list)
    assert len(body) == 1
    assert body[0]['type'] == 'EXACT'
    assert isinstance(body[0]['financingStatement'], dict)
    assert body[0]['financingStatement']['baseRegistrationNumber'] == matching_reg_num
    assert body[0]['financingStatement']['type'] == 'SECURITY_AGREEMENT'
    assert body[0]['financingStatement']['registrationDateTime'] == fin_stmt.events[0].registration_date.isoformat(
        timespec='seconds')
    assert isinstance(body[0]['financingStatement']['registeringParty'], dict)
    assert isinstance(body[0]['financingStatement']['securedParties'], list)
    assert isinstance(body[0]['financingStatement']['debtors'], list)
    assert isinstance(body[0]['financingStatement']['vehicleCollateral'], list)
    assert isinstance(body[0]['financingStatement']['generalCollateral'], list)


def create_test_search_record(type_code: str, criteria: dict, matches: list = []):
    db = models.database.SessionLocal()
    try:
        search_rec = models.search.Search(type_code=type_code, criteria=criteria)
        db.add(search_rec)

        for reg in matches:
            search_rec.results.append(models.search.SearchResult(registration_number=reg, exact=True, selected=True))

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


def create_test_financing_statement(num_of_events: int = 1):
    db = models.database.SessionLocal()
    try:
        reg_num = next_reg_number(db)
        fin_stmt = models.financing_statement.FinancingStatement(
            registration_number=reg_num, status='A', life_in_years=-1,
            registration_type_code=schemas.financing_statement.RegistrationType.SECURITY_AGREEMENT.value
        )
        event = models.financing_statement.FinancingStatementEvent(registration_number=reg_num)
        fin_stmt.events.append(event)

        # Add additional events if needed
        for n in range(1, num_of_events):
            fin_stmt.events.append(
                models.financing_statement.FinancingStatementEvent(registration_number=next_reg_number(db))
            )

        db.add(fin_stmt)
        db.commit()
        db.refresh(fin_stmt)
        fin_stmt.events  # Explicitly lazy load the events before closing the session
        return fin_stmt
    finally:
        db.close()


def next_reg_number(db):
    return str(db.execute("SELECT nextval('reg_number_seq')").first()[0])
