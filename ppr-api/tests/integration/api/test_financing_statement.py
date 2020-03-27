import datetime

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
    assert body['lifeYears'] == 5
    assert body['registrationDateTime'] == fin_stmt.events[0].registration_date.isoformat(timespec='seconds')


def test_read_financing_statement_with_no_expiry():
    fin_stmt = sample_data_utility.create_test_financing_statement(type_code='SA', years=-1)

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    assert rv.status_code == 200
    body = rv.json()

    assert body['expiryDate'] is None
    assert body['lifeYears'] is None


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


def test_read_financing_statement_debtor_details():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        debtors=[{
            'first_name': 'Homer', 'middle_name': 'Jay', 'last_name': 'Simpson', 'business_name': 'Mr. Plow',
            'birthdate': datetime.date(1990, 6, 15),
            'address': {'line1': '742 Evergreen Terrace', 'line2': '1st floor', 'city': 'Springfield',
                        'region': 'BC', 'country': 'CA', 'postal_code': 'V1A 1A1'}
        }]
    )

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    body = rv.json()

    assert len(body['debtors']) == 1
    assert body['debtors'][0]['businessName'] == 'Mr. Plow'
    assert body['debtors'][0]['personName']['first'] == 'Homer'
    assert body['debtors'][0]['personName']['middle'] == 'Jay'
    assert body['debtors'][0]['personName']['last'] == 'Simpson'
    assert body['debtors'][0]['address']['street'] == '742 Evergreen Terrace'
    assert body['debtors'][0]['address']['streetAdditional'] == '1st floor'
    assert body['debtors'][0]['address']['city'] == 'Springfield'
    assert body['debtors'][0]['address']['region'] == 'BC'
    assert body['debtors'][0]['address']['country'] == 'CA'
    assert body['debtors'][0]['address']['postalCode'] == 'V1A 1A1'
    assert body['debtors'][0]['birthdate'] == '1990-06-15'


def test_read_financing_statement_secured_party_details():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        secured_parties=[{
            'first_name': 'Homer', 'middle_name': 'Jay', 'last_name': 'Simpson', 'business_name': 'Mr. Plow',
            'address': {'line1': '742 Evergreen Terrace', 'line2': '1st floor', 'city': 'Springfield',
                        'region': 'BC', 'country': 'CA', 'postal_code': 'V1A 1A1'}
        }]
    )

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    body = rv.json()

    assert len(body['securedParties']) == 1
    assert body['securedParties'][0]['businessName'] == 'Mr. Plow'
    assert body['securedParties'][0]['personName']['first'] == 'Homer'
    assert body['securedParties'][0]['personName']['middle'] == 'Jay'
    assert body['securedParties'][0]['personName']['last'] == 'Simpson'
    assert body['securedParties'][0]['address']['street'] == '742 Evergreen Terrace'
    assert body['securedParties'][0]['address']['streetAdditional'] == '1st floor'
    assert body['securedParties'][0]['address']['city'] == 'Springfield'
    assert body['securedParties'][0]['address']['region'] == 'BC'
    assert body['securedParties'][0]['address']['country'] == 'CA'
    assert body['securedParties'][0]['address']['postalCode'] == 'V1A 1A1'
    assert 'birthdate' not in body['securedParties'][0]


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


def test_read_financing_statement_vehicle_collateral_details():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        vehicle_collateral=[{
            'type_code': 'MV', 'year': 1997, 'make': 'Honda', 'model': 'Civic', 'serial_number': '1HGEJ8258VL115351',
            'mhr_number': '1234567'
        }]
    )

    rv = client.get('/financing-statements/{}'.format(fin_stmt.registration_number))
    body = rv.json()

    assert len(body['vehicleCollateral']) == 1
    assert body['vehicleCollateral'][0]['type'] == 'MOTOR_VEHICLE'
    assert body['vehicleCollateral'][0]['year'] == 1997
    assert body['vehicleCollateral'][0]['make'] == 'Honda'
    assert body['vehicleCollateral'][0]['model'] == 'Civic'
    assert body['vehicleCollateral'][0]['serial'] == '1HGEJ8258VL115351'
    assert body['vehicleCollateral'][0]['manufacturedHomeRegNumber'] == '1234567'


def test_create_financing_statement_for_root_object_details():
    request_payload = get_minimal_payload()
    request_payload.update(type='SECURITY_AGREEMENT', lifeYears=5)

    rv = client.post('/financing-statements', json=request_payload)

    assert rv.status_code == 201
    body = rv.json()
    assert body['type'] == 'SECURITY_AGREEMENT'
    assert body['lifeYears'] == 5
    assert body['lifeInfinite'] is False

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


def test_create_financing_statement_with_infinite_expiry():
    request_payload = get_minimal_payload()
    request_payload.update(type='SECURITY_AGREEMENT', lifeInfinite=True, lifeYears=None)

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert body['lifeInfinite'] is True
    assert body['lifeYears'] is None
    assert body['expiryDate'] is None

    registration_number = body['baseRegistrationNumber']

    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    assert stored.life_in_years == -1
    assert stored.expiry_date is None


def test_create_financing_statement_persists_registering_party():
    request_payload = get_minimal_payload()
    request_payload.update(
        registeringParty={
            'businessName': 'Mr. Plow',
            'personName': {'first': 'Homer', 'middle': 'Jay', 'last': 'Simpson'},
            'address': {'street': '742 Evergreen Terrace', 'streetAdditional': '1st floor', 'city': 'Springfield',
                        'region': 'BC', 'country': 'CA', 'postalCode': 'V1A 1A1'}
        }
    )

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert 'registeringParty' in body
    assert body['registeringParty']['personName']
    assert body['registeringParty']['address']

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    registering_party = stored.get_registering_party()

    assert registering_party
    assert registering_party.base_registration_number == registration_number
    assert registering_party.starting_registration_number == registration_number
    assert registering_party.ending_registration_number is None
    assert registering_party.first_name == 'Homer'
    assert registering_party.middle_name == 'Jay'
    assert registering_party.last_name == 'Simpson'
    assert registering_party.business_name == 'Mr. Plow'
    assert registering_party.address.line1 == '742 Evergreen Terrace'
    assert registering_party.address.line2 == '1st floor'
    assert registering_party.address.city == 'Springfield'
    assert registering_party.address.region == 'BC'
    assert registering_party.address.country == 'CA'
    assert registering_party.address.postal_code == 'V1A 1A1'


def test_create_financing_statement_persists_secured_party():
    request_payload = get_minimal_payload()
    request_payload.update(
        securedParties=[{
            'businessName': 'Mr. Plow', 'personName': {'first': 'Homer', 'middle': 'Jay', 'last': 'Simpson'},
            'address': {'street': '742 Evergreen Terrace', 'streetAdditional': '1st floor', 'city': 'Springfield',
                        'region': 'BC', 'country': 'CA', 'postalCode': 'V1A 1A1'}
        }]
    )

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert len(body['securedParties']) == 1

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    secured_parties = stored.get_secured_parties()

    assert len(secured_parties) == 1
    assert secured_parties[0].base_registration_number == registration_number
    assert secured_parties[0].starting_registration_number == registration_number
    assert secured_parties[0].ending_registration_number is None
    assert secured_parties[0].first_name == 'Homer'
    assert secured_parties[0].middle_name == 'Jay'
    assert secured_parties[0].last_name == 'Simpson'
    assert secured_parties[0].business_name == 'Mr. Plow'
    assert secured_parties[0].address.line1 == '742 Evergreen Terrace'
    assert secured_parties[0].address.line2 == '1st floor'
    assert secured_parties[0].address.city == 'Springfield'
    assert secured_parties[0].address.region == 'BC'
    assert secured_parties[0].address.country == 'CA'
    assert secured_parties[0].address.postal_code == 'V1A 1A1'
    assert secured_parties[0].birthdate is None


def test_create_financing_statement_persists_debtor():
    request_payload = get_minimal_payload()
    request_payload.update(
        debtors=[{
            'businessName': 'Mr. Plow', 'birthdate': '1990-06-15',
            'personName': {'first': 'Homer', 'middle': 'Jay', 'last': 'Simpson'},
            'address': {'street': '742 Evergreen Terrace', 'streetAdditional': '1st floor', 'city': 'Springfield',
                        'region': 'BC', 'country': 'CA', 'postalCode': 'V1A 1A1'}
        }]
    )

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert len(body['debtors']) == 1
    assert body['debtors'][0]['personName']
    assert body['debtors'][0]['address']

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    debtors = stored.get_debtors()

    assert len(debtors) == 1
    assert debtors[0].base_registration_number == registration_number
    assert debtors[0].starting_registration_number == registration_number
    assert debtors[0].ending_registration_number is None
    assert debtors[0].first_name == 'Homer'
    assert debtors[0].middle_name == 'Jay'
    assert debtors[0].last_name == 'Simpson'
    assert debtors[0].business_name == 'Mr. Plow'
    assert debtors[0].birthdate == datetime.date(1990, 6, 15)
    assert debtors[0].address.line1 == '742 Evergreen Terrace'
    assert debtors[0].address.line2 == '1st floor'
    assert debtors[0].address.city == 'Springfield'
    assert debtors[0].address.region == 'BC'
    assert debtors[0].address.country == 'CA'
    assert debtors[0].address.postal_code == 'V1A 1A1'


def test_create_financing_statement_persists_general_collateral():
    request_payload = get_minimal_payload()
    request_payload.update(
        generalCollateral=[{'description': 'general collateral description'}]
    )

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert 'generalCollateral' in body
    assert len(body['generalCollateral']) == 1
    collateral_body = body['generalCollateral'][0]
    assert collateral_body['description'] == 'general collateral description'
    assert 'addedDateTime' in collateral_body

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)

    assert len(stored.general_collateral) == 1
    assert stored.general_collateral[0].description == 'general collateral description'
    assert stored.events[0].registration_date.isoformat(timespec='seconds') == collateral_body['addedDateTime']


def test_create_financing_statement_persists_vehicle_collateral():
    request_payload = get_minimal_payload()
    request_payload.update(
        vehicleCollateral=[{
            'type': 'MOTOR_VEHICLE', 'year': 1997, 'make': 'Honda', 'model': 'Civic', 'serial': '1HGEJ8258VL115351',
            'manufacturedHomeRegNumber': '1234567'
        }]
    )

    rv = client.post('/financing-statements', json=request_payload)

    body = rv.json()
    assert 'vehicleCollateral' in body
    assert len(body['vehicleCollateral']) == 1

    registration_number = body['baseRegistrationNumber']
    stored = sample_data_utility.retrieve_financing_statement_record(registration_number)
    collateral = stored.vehicle_collateral

    assert len(collateral) == 1
    assert collateral[0].type_code == 'MV'
    assert collateral[0].year == 1997
    assert collateral[0].make == 'Honda'
    assert collateral[0].model == 'Civic'
    assert collateral[0].serial_number == '1HGEJ8258VL115351'
    assert collateral[0].mhr_number == '1234567'


def get_minimal_payload():
    return {
        'type': 'SECURITY_AGREEMENT',
        'lifeYears': 5,
        'registeringParty': {'personName': {'first': 'Homer', 'last': 'Simpson'}},
        'securedParties': [],
        'debtors': [],
        'vehicleCollateral': [],
        'generalCollateral': []
    }
