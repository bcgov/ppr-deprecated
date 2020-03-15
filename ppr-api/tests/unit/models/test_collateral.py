import models.collateral
import schemas.collateral


def test_general_collateral_as_schema():
    model = models.collateral.GeneralCollateral(description='Test description')

    schema = model.as_schema()

    assert isinstance(schema, schemas.collateral.GeneralCollateral)
    assert schema.description == 'Test description'


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
