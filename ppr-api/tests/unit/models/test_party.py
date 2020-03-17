import models.party


def test_party_as_schema_business_name_is_used():
    model = models.party.Party(business_name='Mr. Plow')

    schema = model.as_schema()

    assert schema.businessName == 'Mr. Plow'
    assert schema.personName is None


def test_party_as_schema_person_name_is_used():
    model = models.party.Party(first_name='Homer', middle_name='Jay', last_name='Simpson')

    schema = model.as_schema()

    assert schema.personName.first == 'Homer'
    assert schema.personName.middle == 'Jay'
    assert schema.personName.last == 'Simpson'
    assert schema.businessName is None
