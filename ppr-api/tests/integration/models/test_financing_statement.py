from ..utilities import sample_data_utility


def test_financing_statement_vehicle_collateral_should_exclude_ended_items():
    fin_stmt = sample_data_utility.create_test_financing_statement(
        vehicle_collateral=[{'type_code': 'BO', 'serial_number': '7654321'}]
    )
    fin_stmt = sample_data_utility.create_test_financing_statement_event(
        fin_stmt, vehicle_collateral=[{'type_code': 'MH', 'serial_number': '1234567'}]
    )

    assert len(fin_stmt.vehicle_collateral) == 1
    assert fin_stmt.vehicle_collateral[0].type_code == 'MH'
    assert fin_stmt.vehicle_collateral[0].serial_number == '1234567'
