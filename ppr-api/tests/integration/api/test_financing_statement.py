from starlette.testclient import TestClient

import main
from ..utilities import sample_data_utility

client = TestClient(main.app)


def test_read_financing_statement_with_root_object_details():
    fin_stmt = sample_data_utility.create_test_financing_statement(type_code='SA', years=5)

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    assert rv.status_code == 200
    body = rv.json()

    assert body['baseRegistrationNumber'] == fin_stmt.registration_number
    assert body['type'] == 'SECURITY_AGREEMENT'
    assert body['expiryDate'] == fin_stmt.expiry_date.isoformat()
    assert body['years'] == 5
    assert body['registrationDateTime'] == fin_stmt.events[0].registration_date.isoformat(timespec='seconds')


def test_read_financing_statement_with_no_expiry():
    fin_stmt = sample_data_utility.create_test_financing_statement(type_code='SA', years=-1)

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    assert rv.status_code == 200
    body = rv.json()

    assert body['expiryDate'] is None
    assert body['years'] is None


def test_read_financing_statement_with_changed_registering_party_should_provide_active_record():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        registeringParty={'first_name': 'Homer', 'last_name': 'Simpson'}
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, registeringParty={'first_name': 'Charles', 'middle_name': 'Montgomery', 'last_name': 'Burns'}
    )

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    body = rv.json()

    assert body['registeringParty']['name']['first'] == 'Charles'
    assert body['registeringParty']['name']['middle'] == 'Montgomery'
    assert body['registeringParty']['name']['last'] == 'Burns'


def test_create_financing_statement_for_root_object_details():
    request_payload = {
        'type': 'SECURITY_AGREEMENT',
        'years': 5,
        'registeringParty': {'name': {'first': 'Homer', 'last': 'Simpson'}},
        'securedParties': [],
        'debtors': [],
        'vehicleCollateral': [],
        'generalCollateral': []
    }

    rv = client.post('/financing-statements', json=request_payload)

    assert rv.status_code == 201
    body = rv.json()
    assert body['type'] == 'SECURITY_AGREEMENT'
    assert body['years'] == 5

    registration_number = body['baseRegistrationNumber']

    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    assert stored
    assert stored.registration_type_code == 'SA'
    assert stored.status == 'A'
    assert stored.life_in_years == 5
    assert stored.expiry_date.isoformat() == body['expiryDate']
    assert stored.last_updated

    assert len(stored.events) == 1
    assert stored.events[0].registration_number == registration_number
    assert stored.events[0].base_registration_number == registration_number
    assert stored.events[0].user_id == 'fake_user_id'  # Default user for integration tests
    assert stored.events[0].registration_date.isoformat(timespec='seconds') == body['registrationDateTime']


def test_create_financing_statement_persists_secured_party():
    request_payload = {
        'type': 'SECURITY_AGREEMENT',
        'registeringParty': {'name': {'first': 'Homer', 'middle': 'Jay', 'last': 'Simpson'}},
        'securedParties': [],
        'debtors': [],
        'vehicleCollateral': [],
        'generalCollateral': []
    }

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert 'registeringParty' in body
    assert 'name' in body['registeringParty']
    assert body['registeringParty']['name']['first'] == 'Homer'
    assert body['registeringParty']['name']['middle'] == 'Jay'
    assert body['registeringParty']['name']['last'] == 'Simpson'

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    registering_parties = list(filter(lambda party: party.type_code == 'RP', stored.parties))

    assert len(registering_parties) == 1
    assert registering_parties[0].first_name == body['registeringParty']['name']['first']
    assert registering_parties[0].middle_name == body['registeringParty']['name']['middle']
    assert registering_parties[0].last_name == body['registeringParty']['name']['last']
    assert registering_parties[0].base_registration_number == registration_number
    assert registering_parties[0].starting_registration_number == registration_number
    assert registering_parties[0].ending_registration_number is None
