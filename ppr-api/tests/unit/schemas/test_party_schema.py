import schemas.party
import pytest
import datetime


def test_person_name_invalid_no_last():
    try:
        schemas.party.IndividualName(personName={'first': 'John Doe'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since last name is required')


def test_person_name_invalid_no_first():
    try:
        schemas.party.IndividualName(personName={'last': 'John Doe'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since first name is required')


def test_person_name_invalid_only_middle():
    try:
        schemas.party.IndividualName(personName={'middle': 'John Doe'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since first and last name are required')


def test_person_name_invalid_first_and_middle():
    try:
        schemas.party.IndividualName(personName={'first': 'John', 'middle': 'Doe'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since last name is required')


def test_person_name_valid_with_middle():
    name = schemas.party.IndividualName(first='John', last='Doe', middle='Dough')
    assert name == {'first': 'John', 'last': 'Doe', 'middle': 'Dough'}


def test_person_name_valid_no_middle():
    name = schemas.party.IndividualName(first='John', last='Doe')
    assert name == {'first': 'John', 'last': 'Doe', 'middle': None}


def test_address_valid_no_optional():
    address = schemas.party.Address(street='123 Real Street', city='Cranbrook',
                                           country='BC', postalCode='V8V 0B6')

    assert address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'BC',
                       'postalCode': 'V8V 0B6', 'streetAdditional': None, 'region': None}


def test_address_valid_optional():
    address = schemas.party.Address(street='123 Real Street', city='Cranbrook', country='CA',
                                    postalCode='V8V 0B6', streetAdditional='Suite 203', region='BC')

    assert address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                       'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'}


def test_debtor_invalid_only_address():
    try:
        schemas.party.Debtor(address={
            'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
            'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'})
    except KeyError:
        pass
    else:
        pytest.fail('A validation error was expected since there must be a party')


def test_debtor_invalid_only_person():
    try:
        schemas.party.Debtor(personName={'first': 'John', 'last': 'Doe'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since there must be an address')


def test_debtor_invalid_only_business():
    try:
        schemas.party.Debtor(businessName='Globotech')
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since there must be an address')


def test_debtor_invalid_person_name_business_name_no_address():
    try:
        schemas.party.Debtor(businessName='Globotech', personName={'first': '123 Real Street', 'last': 'Cranbrook CA'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since there must be an address')


def test_debtor_valid_address_person_name():
    party = schemas.party.Debtor(address={'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                                          'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'},
                                 personName={'first': 'John', 'last': 'Doe'})
    assert party.address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                             'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'}
    assert party.personName.first == 'John'
    assert party.personName.last == 'Doe'


def test_debtor_valid_address_business_name():
    party = schemas.party.Debtor(address={'street': '123 Globo Street', 'city': 'Vancouver', 'country': 'CA',
                                          'postalCode': 'V8V V8V', 'streetAdditional': 'Suite 900', 'region': 'BC'},
                                 businessName='Globotech')
    assert party.address == {'street': '123 Globo Street', 'city': 'Vancouver', 'country': 'CA',
                             'postalCode': 'V8V V8V', 'streetAdditional': 'Suite 900', 'region': 'BC'}
    assert party.businessName == 'Globotech'


def test_debtor_valid_individual_party_birthdate_included():
    party = schemas.party.Debtor(address={'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                                          'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'},
                                 birthdate=datetime.date(1965, 1, 1), personName={'first': 'John', 'last': 'Doe'})
    assert party.birthdate == datetime.date(1965, 1, 1)
    assert party.address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                             'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'}
    assert party.personName.first == 'John'
    assert party.personName.last == 'Doe'
