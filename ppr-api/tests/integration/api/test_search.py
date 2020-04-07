import datetime
import random
import string

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

    rv = client.post('/searches', json=search_input, headers={'Account-Id': 'fake_account_id'})

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
    assert stored.account_id == 'fake_account_id'
    assert body['searchDateTime'] == stored.creation_date_time.isoformat(timespec='seconds')


def test_create_mhr_number_search():
    mhr_number = ''.join(random.choices(string.digits, k=7))
    fin_stmt = sample_data_utility.create_test_financing_statement(
        vehicle_collateral=[{'type_code': 'MH', 'mhr_number': mhr_number}]
    )
    search_input = {'type': 'MHR_NUMBER', 'criteria': {'value': mhr_number}}

    rv = client.post('/searches', json=search_input, headers={'Account-Id': 'fake_account_id'})

    assert rv.status_code == 201
    body = rv.json()
    assert body['type'] == 'MHR_NUMBER'
    assert body['criteria'] == {'value': mhr_number}
    result_id = body['id']
    assert result_id > 0

    stored = sample_data_utility.retrieve_search_record(result_id)
    assert stored
    assert stored.type_code == 'MHR_NUMBER'
    assert stored.criteria == {'value': mhr_number}

    assert len(stored.results) == 1
    assert stored.results[0].registration_number == fin_stmt.get_base_event().registration_number
    assert stored.results[0].exact is True


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


def test_create_registration_number_search_matches_latest_registration_number():
    fin_stmt = sample_data_utility.create_test_financing_statement()
    fin_stmt = sample_data_utility.create_test_financing_statement_event(fin_stmt)
    fin_stmt = sample_data_utility.create_test_financing_statement_event(fin_stmt)
    events = sorted(fin_stmt.events, key=lambda e: e.registration_date)
    search_value = events[1].registration_number
    expected_result = events[2].registration_number
    search_input = {'type': 'REGISTRATION_NUMBER', 'criteria': {'value': search_value}}

    rv = client.post('/searches', json=search_input)

    body = rv.json()
    search_id = body['id']

    search_results = sample_data_utility.retrieve_search_result_records(search_id)
    assert len(search_results) == 1
    search_result = search_results[0]
    assert search_result.registration_number == expected_result


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
        registering_party={'first_name': 'Homer', 'middle_name': 'Jay', 'last_name': 'Simpson',
                           'business_name': 'Mr. Plow',
                           'address': {'line1': '724 Evergreen Terrace', 'line2': 'first floor', 'city': 'Springfield',
                                       'region': 'BC', 'country': 'CA', 'postal_code': 'V1A 1A1'}}
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, registering_party={'first_name': 'Charles', 'middle_name': 'Montgomery', 'last_name': 'Burns'}
    )
    search = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER',
                                                           {'value': fin_stmt.registration_number},
                                                           [fin_stmt.registration_number])

    rv = client.get('/searches/{}/results'.format(search.id))
    body = rv.json()

    reg_party = body[0]['financingStatement']['registeringParty']
    assert reg_party['personName']['first'] == 'Homer'
    assert reg_party['personName']['middle'] == 'Jay'
    assert reg_party['personName']['last'] == 'Simpson'
    assert reg_party['businessName'] == 'Mr. Plow'
    assert reg_party['address']['street'] == '724 Evergreen Terrace'
    assert reg_party['address']['streetAdditional'] == 'first floor'
    assert reg_party['address']['city'] == 'Springfield'
    assert reg_party['address']['region'] == 'BC'
    assert reg_party['address']['country'] == 'CA'
    assert reg_party['address']['postalCode'] == 'V1A 1A1'
    assert 'birthdate' not in reg_party


def test_search_results_should_provide_general_collateral_at_time_of_search():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        general_collateral=['original collateral']
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, general_collateral=['time of search collateral']
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, general_collateral=['present collateral']
    )
    result_reg_number = sorted(fin_stmt.events, key=lambda e: e.registration_date)[1].registration_number
    search = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER',
                                                           {'value': fin_stmt.registration_number}, [result_reg_number])

    rv = client.get('/searches/{}/results'.format(search.id))
    body = rv.json()

    general_collateral = body[0]['financingStatement']['generalCollateral']
    assert len(general_collateral) == 1
    assert general_collateral[0]['description'] == 'time of search collateral'


def test_search_results_should_provide_secured_parties_details():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        secured_parties=[{'first_name': 'Homer', 'middle_name': 'Jay', 'last_name': 'Simpson',
                          'business_name': 'Mr. Plow',
                          'address': {'line1': '724 Evergreen Terrace', 'line2': '1st floor', 'city': 'Springfield',
                                      'region': 'BC', 'country': 'CA', 'postal_code': 'V1A 1A1'}}]
    )
    search = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER',
                                                           {'value': fin_stmt.registration_number},
                                                           [fin_stmt.registration_number])

    rv = client.get('/searches/{}/results'.format(search.id))
    body = rv.json()

    assert len(body[0]['financingStatement']['securedParties']) == 1
    secured_party = body[0]['financingStatement']['securedParties'][0]
    assert secured_party['personName']['first'] == 'Homer'
    assert secured_party['personName']['middle'] == 'Jay'
    assert secured_party['personName']['last'] == 'Simpson'
    assert secured_party['businessName'] == 'Mr. Plow'
    assert secured_party['address']['street'] == '724 Evergreen Terrace'
    assert secured_party['address']['streetAdditional'] == '1st floor'
    assert secured_party['address']['city'] == 'Springfield'
    assert secured_party['address']['region'] == 'BC'
    assert secured_party['address']['country'] == 'CA'
    assert secured_party['address']['postalCode'] == 'V1A 1A1'
    assert 'birthdate' not in secured_party


def test_search_results_should_provide_debtor_details():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        debtors=[{'first_name': 'Homer', 'middle_name': 'Jay', 'last_name': 'Simpson', 'business_name': 'Mr. Plow',
                  'birthdate': datetime.date(2019, 6, 17),
                  'address': {'line1': '724 Evergreen Terrace', 'line2': '1st floor', 'city': 'Springfield',
                              'region': 'BC', 'country': 'CA', 'postal_code': 'V1A 1A1'}}]
    )
    search = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER',
                                                           {'value': fin_stmt.registration_number},
                                                           [fin_stmt.registration_number])

    rv = client.get('/searches/{}/results'.format(search.id))
    body = rv.json()

    assert len(body[0]['financingStatement']['debtors']) == 1
    debtor = body[0]['financingStatement']['debtors'][0]
    assert debtor['personName']['first'] == 'Homer'
    assert debtor['personName']['middle'] == 'Jay'
    assert debtor['personName']['last'] == 'Simpson'
    assert debtor['businessName'] == 'Mr. Plow'
    assert debtor['birthdate'] == datetime.date(2019, 6, 17).isoformat()
    assert debtor['address']['street'] == '724 Evergreen Terrace'
    assert debtor['address']['streetAdditional'] == '1st floor'
    assert debtor['address']['city'] == 'Springfield'
    assert debtor['address']['region'] == 'BC'
    assert debtor['address']['country'] == 'CA'
    assert debtor['address']['postalCode'] == 'V1A 1A1'


def test_search_results_should_provide_vehicle_collateral_details():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        vehicle_collateral=[{
            'type_code': 'MH', 'year': 1997, 'make': 'Honda', 'model': 'Civic', 'serial_number': '1HGEJ8258VL115351',
            'mhr_number': '7654098'
        }]
    )
    search = sample_data_utility.create_test_search_record('REGISTRATION_NUMBER',
                                                           {'value': fin_stmt.registration_number},
                                                           [fin_stmt.registration_number])

    rv = client.get('/searches/{}/results'.format(search.id))
    body = rv.json()

    assert len(body[0]['financingStatement']['vehicleCollateral']) == 1
    collateral = body[0]['financingStatement']['vehicleCollateral'][0]
    assert collateral['type'] == 'MANUFACTURED_HOME'
    assert collateral['year'] == 1997
    assert collateral['make'] == 'Honda'
    assert collateral['model'] == 'Civic'
    assert collateral['serial'] == '1HGEJ8258VL115351'
    assert collateral['manufacturedHomeRegNumber'] == '7654098'
