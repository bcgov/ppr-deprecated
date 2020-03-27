import datetime

import models.collateral
import models.financing_statement
import schemas.collateral


def test_general_collateral_list_as_schema_should_group_items_with_same_start():
    event = models.financing_statement.FinancingStatementEvent(registration_number='1234',
                                                               registration_date=datetime.datetime.now())
    model1 = models.collateral.GeneralCollateral(description='Test description', starting_registration_number='1234')
    model2 = models.collateral.GeneralCollateral(description=' - Part 2', starting_registration_number='1234')

    schema = models.collateral.GeneralCollateral.list_as_schema([model1, model2], [event])

    assert len(schema) == 1
    assert isinstance(schema[0], schemas.collateral.GeneralCollateral)
    assert schema[0].description == 'Test description - Part 2'
    assert schema[0].addedDateTime == event.registration_date


def test_general_collateral_list_as_schema_should_not_group_items_with_different_start():
    now = datetime.datetime.now()
    event1 = models.financing_statement.FinancingStatementEvent(registration_number='1234', registration_date=now)
    event2 = models.financing_statement.FinancingStatementEvent(registration_number='4321',
                                                                registration_date=now + datetime.timedelta(seconds=1))
    model1 = models.collateral.GeneralCollateral(description='Test description 1', starting_registration_number='1234')
    model2 = models.collateral.GeneralCollateral(description='Test description 2', starting_registration_number='4321')

    schema = models.collateral.GeneralCollateral.list_as_schema([model1, model2], [event1, event2])

    assert len(schema) == 2
    assert schema[0].description == 'Test description 1'
    assert schema[0].addedDateTime == event1.registration_date
    assert schema[1].description == 'Test description 2'
    assert schema[1].addedDateTime == event2.registration_date


def test_general_collateral_list_as_schema_should_use_none_date_when_event_not_found():
    model = models.collateral.GeneralCollateral(description='Test description', starting_registration_number='1234')

    schema = models.collateral.GeneralCollateral.list_as_schema([model], [])

    assert len(schema) == 1
    assert schema[0].addedDateTime is None
    assert schema[0].description == 'Test description'


def test_vehicle_collateral_as_schema_with_motor_vehicle():
    model = models.collateral.VehicleCollateral(
        type_code='MV', year=1997, make='Honda', model='Civic', serial_number='1HGEJ8258VL115351'
    )

    schema = model.as_schema()

    assert isinstance(schema, schemas.collateral.VehicleCollateral)
    assert schema.type == schemas.collateral.VehicleType.MOTOR_VEHICLE.name
    assert schema.year == 1997
    assert schema.make == 'Honda'
    assert schema.model == 'Civic'
    assert schema.serial == '1HGEJ8258VL115351'


def test_vehicle_collateral_as_schema_with_manufactured_home():
    model = models.collateral.VehicleCollateral(
        type_code='MH', mhr_number='1234567'
    )

    schema = model.as_schema()

    assert schema.type == schemas.collateral.VehicleType.MANUFACTURED_HOME.name
    assert schema.manufacturedHomeRegNumber == '1234567'
