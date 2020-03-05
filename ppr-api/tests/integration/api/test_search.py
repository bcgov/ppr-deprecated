from starlette.testclient import TestClient

import main
from ..utilities import sample_data_utility

client = TestClient(main.app)


def test_read_search(mock_payment):
    search_rec = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER', {'value': '1234567'},
                                                               payment=mock_payment)

    rv = client.get('/searches/{}'.format(search_rec.id))
    assert rv.status_code == 200
    search = rv.json()
    assert search['id'] == search_rec.id
    assert search['type'] == 'REGISTRATION_NUMBER'
    assert search['criteria'] == {'value': '1234567'}
    assert search['searchDateTime'] == search_rec.creation_date_time.isoformat(timespec='seconds')
    assert search['payment']['id'] == search_rec.payment_id


def test_create_registration_number_search():
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': '987654Z'}}

    rv = client.post('/searches', json=search_input)

    assert rv.status_code == 201
    body = rv.json()
    assert body['type'] == 'REGISTRATION_NUMBER'
    assert body['criteria'] == {'value': '987654Z'}
    result_id = body['id']
    assert result_id > 0

    stored = sample_data_utility.retrieve_search_record(result_id)
    assert stored
    assert stored.type_code == 'REGISTRATION_NUMBER'
    assert stored.criteria == {'value': '987654Z'}
    assert stored.user_id == 'fake_user_id'  # Default user for integration tests
    assert body['searchDateTime'] == stored.creation_date_time.isoformat(timespec='seconds')


def test_create_search_returns_payment_info():
    search_input = {'type': 'SERIAL_NUMBER', 'criteria': {'value': 'ABC123456'}}

    rv = client.post('/searches', json=search_input)

    body = rv.json()

    # Ensure default payment info for integration tests is provided.  See ../conftest.py
    assert 'payment' in body
    assert body['payment']['status'] == 'CREATED'
    assert body['payment']['method'] == 'CC'

    stored = sample_data_utility.retrieve_search_record(body['id'])
    assert body['payment']['id'] == stored.payment_id


def test_create_search_with_exact_match():
    search_value = sample_data_utility.create_test_financing_statement().registration_number
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': search_value}}

    rv = client.post('/searches', json=search_input)

    body = rv.json()
    search_id = body['id']

    search_results = sample_data_utility.retrieve_search_result_records(search_id)
    assert len(search_results) == 1
    search_result = search_results[0]
    assert search_result.registration_number == search_value
    assert search_result.exact
    assert search_result.selected


def test_create_registration_number_search_matches_non_base_registration():
    search_value = sample_data_utility.create_test_financing_statement(num_of_events=2).events[1].registration_number
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': search_value}}

    rv = client.post('/searches', json=search_input)

    body = rv.json()
    search_id = body['id']

    search_results = sample_data_utility.retrieve_search_result_records(search_id)
    assert len(search_results) == 1
    search_result = search_results[0]
    assert search_result.registration_number == search_value


def test_read_singular_search_results():
    fin_stmt = sample_data_utility.create_test_financing_statement()
    matching_reg_num = fin_stmt.registration_number
    search_rec = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER', {'value': matching_reg_num},
                                                               [matching_reg_num], None)

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
    assert body[0]['financingStatement']['registeringParty'] is None
    assert isinstance(body[0]['financingStatement']['securedParties'], list)
    assert isinstance(body[0]['financingStatement']['debtors'], list)
    assert isinstance(body[0]['financingStatement']['vehicleCollateral'], list)
    assert isinstance(body[0]['financingStatement']['generalCollateral'], list)


def test_search_results_should_provide_party_at_time_of_search():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        registering_party={'first_name': 'Homer', 'middle_name': 'Jay', 'last_name': 'Simpson'}
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, registering_party={'first_name': 'Charles', 'middle_name': 'Montgomery', 'last_name': 'Burns'}
    )
    search = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER',
                                                           {'value': fin_stmt.registration_number},
                                                           [fin_stmt.registration_number])

    rv = client.get('/searches/{}/results'.format(search.id))
    body = rv.json()

    reg_part_name = body[0]['financingStatement']['registeringParty']['personName']
    assert reg_part_name['first'] == 'Homer'
    assert reg_part_name['middle'] == 'Jay'
    assert reg_part_name['last'] == 'Simpson'
