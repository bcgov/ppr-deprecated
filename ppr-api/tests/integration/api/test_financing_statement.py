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
