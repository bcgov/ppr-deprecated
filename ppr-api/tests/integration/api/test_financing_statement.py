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
        registering_party={'first_name': 'Homer', 'last_name': 'Simpson'}
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, registering_party={'first_name': 'Charles', 'middle_name': 'Montgomery', 'last_name': 'Burns'}
    )

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    body = rv.json()

    assert body['registeringParty']['personName']['first'] == 'Charles'
    assert body['registeringParty']['personName']['middle'] == 'Montgomery'
    assert body['registeringParty']['personName']['last'] == 'Burns'


def test_read_financing_statement_with_changed_general_collateral_should_provide_active_record():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        general_collateral=['base registration general collateral']
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, general_collateral=['secondary registration collateral']
    )

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    body = rv.json()

    assert len(body['generalCollateral']) == 1
    assert body['generalCollateral'][0]['description'] == 'secondary registration collateral'


def test_create_financing_statement_for_root_object_details():
    request_payload = get_minimal_payload()
    request_payload.update(type='SECURITY_AGREEMENT', years=5)

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


def test_create_financing_statement_persists_registering_party():
    request_payload = get_minimal_payload()
    request_payload.update(registeringParty={'personName': {'first': 'Homer', 'middle': 'Jay', 'last': 'Simpson'}})

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert 'registeringParty' in body
    assert 'personName' in body['registeringParty']
    assert body['registeringParty']['personName']['first'] == 'Homer'
    assert body['registeringParty']['personName']['middle'] == 'Jay'
    assert body['registeringParty']['personName']['last'] == 'Simpson'

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    registering_parties = list(filter(lambda party: party.type_code == 'RP', stored.parties))

    assert len(registering_parties) == 1
    assert registering_parties[0].first_name == body['registeringParty']['personName']['first']
    assert registering_parties[0].middle_name == body['registeringParty']['personName']['middle']
    assert registering_parties[0].last_name == body['registeringParty']['personName']['last']
    assert registering_parties[0].base_registration_number == registration_number
    assert registering_parties[0].starting_registration_number == registration_number
    assert registering_parties[0].ending_registration_number is None


def test_create_financing_statement_persists_general_collateral():
    request_payload = get_minimal_payload()
    request_payload.update(
        generalCollateral=[{'description': 'general collateral 1'}, {'description': 'general collateral 2'}]
    )

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert 'generalCollateral' in body
    assert len(body['generalCollateral']) == 2
    assert next(x for x in body['generalCollateral'] if x['description'] == 'general collateral 1')
    assert next(x for x in body['generalCollateral'] if x['description'] == 'general collateral 2')

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)

    assert len(stored.general_collateral) == 2
    assert next(x for x in stored.general_collateral if x.description == 'general collateral 1')
    assert next(x for x in stored.general_collateral if x.description == 'general collateral 2')


def get_minimal_payload():
    return {
        'type': 'SECURITY_AGREEMENT',
        'registeringParty': {'personName': {'first': 'Homer', 'last': 'Simpson'}},
        'securedParties': [],
        'debtors': [],
        'vehicleCollateral': [],
        'generalCollateral': []
    }
