import datetime

import pytest

import schemas.party


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


def test_person_name_invalid_last_and_middle():
    try:
        schemas.party.IndividualName(personName={'last': 'Doe', 'middle': 'John'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since first name is required')


def test_person_name_invalid_not_alpha_first():
    try:
        schemas.party.IndividualName(first='J0hn', last='Doe')
    except AssertionError:
        pass
    else:
        pytest.fail('A validation error was expected since "first" contains invalid character')


def test_person_name_invalid_not_alpha_last():
    try:
        schemas.party.IndividualName(first='John', last='Doe!')
    except AssertionError:
        pass
    else:
        pytest.fail('A validation error was expected since "last" contains invalid character')


def test_person_name_invalid_not_alpha_middle():
    try:
        schemas.party.IndividualName(first='John', middle='$herman', last='Doe')
    except AssertionError:
        pass
    else:
        pytest.fail('A validation error was expected since "middle" contains invalid character')


def test_person_name_valid_no_middle():
    name = schemas.party.IndividualName(first='John', last='Doe')
    assert name == {'first': 'John', 'middle': None, 'last': 'Doe'}


def test_person_name_valid_with_middle():
    name = schemas.party.IndividualName(first='John', middle='Sherman', last='Doe')
    assert name == {'first': 'John', 'middle': 'Sherman', 'last': 'Doe'}


def test_person_name_valid_with_special():
    name = schemas.party.IndividualName(first="J'ohn-Boy", middle="D'ean-Dre", last="D'oe-Doughington")
    assert name == {'first': "J'ohn-Boy", 'middle': "D'ean-Dre", 'last': "D'oe-Doughington"}


def test_business_name_invalid_special_char():
    try:
        schemas.party.Party(businessName='Globotech!')
    except AssertionError:
        pass
    else:
        pytest.fail('A validation error was expected due to invalid character')


def test_business_name_valid_simple():
    name = schemas.party.Party(businessName='Globotech')
    assert name.businessName == 'Globotech'


def test_business_name_valid_special_chars_alphanumeric():
    name = schemas.party.Party(businessName='Aa-\'"&:,$%.+;/zZ1234567890 ')
    assert name.businessName == 'Aa-\'"&:,$%.+;/zZ1234567890 '


def test_address_invalid_no_street():
    try:
        schemas.party.Address(city='Cranbrook', country='CA', postalCode='V8V 0B6')
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since "street" is required')


def test_address_invalid_no_city():
    try:
        schemas.party.Address(street='123 Real Street', country='CA', postalCode='V8V 0B6')
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since "city" is required')


def test_address_invalid_no_country():
    try:
        schemas.party.Address(street='123 Real Street', city='Cranbrook', postalCode='V8V 0B6')
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since "country" is required')


def test_address_invalid_no_postal():
    try:
        schemas.party.Address(street='123 Real Street', city='Cranbrook', country='CA')
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since "postalCode" is required')


def test_address_valid_no_optional():
    address = schemas.party.Address(street='123 Real Street', city='Cranbrook',
                                           country='CA', postalCode='V8V 0B6')

    assert address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                       'postalCode': 'V8V 0B6', 'streetAdditional': None, 'region': None}


def test_address_valid_optional():
    address = schemas.party.Address(street='123 Real Street', city='Cranbrook', country='CA',
                                    postalCode='V8V 0B6', streetAdditional='Suite 203', region='BC')

    assert address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                       'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'}


def test_debtor_invalid_business_and_person_name():
    try:
        schemas.party.Debtor(address={'street': '123 Globo Street', 'city': 'Vancouver', 'country': 'CA',
                                      'postalCode': 'V8V V8V', 'region': 'BC'},
                             businessName='Globotech', personName={'first': 'John', 'last': 'Doe'})
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since Debtor cannot have both business and individual name')


def test_debtor_valid_address_person_name():
    debtor = schemas.party.Debtor(address={'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                                           'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'},
                                  personName={'first': 'John', 'last': 'Doe'})
    assert debtor.address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                              'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'}
    assert debtor.personName.first == 'John'
    assert debtor.personName.last == 'Doe'


def test_debtor_valid_address_business_name():
    debtor = schemas.party.Debtor(address={'street': '123 Globo Street', 'city': 'Vancouver', 'country': 'CA',
                                           'postalCode': 'V8V V8V', 'streetAdditional': 'Suite 900', 'region': 'BC'},
                                  businessName='Globotech Industries')
    assert debtor.address == {'street': '123 Globo Street', 'city': 'Vancouver', 'country': 'CA',
                              'postalCode': 'V8V V8V', 'streetAdditional': 'Suite 900', 'region': 'BC'}
    assert debtor.businessName == 'Globotech Industries'


def test_debtor_valid_address_person_birthdate_included():
    debtor = schemas.party.Debtor(address={'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                                           'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'},
                                  birthdate=datetime.date(1965, 1, 1), personName={'first': 'Johnny', 'last': 'Dough'})
    assert debtor.birthdate == datetime.date(1965, 1, 1)
    assert debtor.address == {'street': '123 Real Street', 'city': 'Cranbrook', 'country': 'CA',
                              'postalCode': 'V8V 0B6', 'streetAdditional': 'Suite 203', 'region': 'BC'}
    assert debtor.personName.first == 'Johnny'
    assert debtor.personName.last == 'Dough'
