import pytest

import schemas.financing_statement
from schemas.financing_statement import RegistrationType


def test_financing_statement_years_integer_over_25():
    try:
        stub_financing_statement_base(years=26)
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_integer_under_1():
    try:
        stub_financing_statement_base(years=-1)
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_integer_0():
    try:
        stub_financing_statement_base(years=0)
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_25():
    financing_statement = stub_financing_statement_base(years=25)
    assert financing_statement.lifeYears == 25


def test_financing_statement_years_1():
    financing_statement = stub_financing_statement_base(years=1)
    assert financing_statement.lifeYears == 1


def test_financing_statement_life_no_values_provided():
    try:
        stub_financing_statement_base(years=None, infinite=None)
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since life was not set')


def test_financing_statement_years_none_and_infinite_life_is_false():
    try:
        stub_financing_statement_base(years=None, infinite=False)
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since life was not set')


def test_financing_statement_infinite_life_with_years():
    try:
        stub_financing_statement_base(years=7, infinite=True)
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since life cannot be true when years are provided')


def test_financing_statement_infinite_life_with_0_years():
    try:
        stub_financing_statement_base(years=0, infinite=True)
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since life cannot be true when years are provided')


def test_financing_statement_years_infinite_life():
    financing_statement = stub_financing_statement_base(infinite=True)
    assert financing_statement.lifeInfinite is True


def stub_financing_statement_base(
        years=None, infinite: bool = None, reg_type: str = RegistrationType.SECURITY_AGREEMENT.name,
        secured_parties: list = [], debtors: list = [], vehicle_collateral: list = [], general_collateral: list = []):
    return schemas.financing_statement.FinancingStatementBase(
        lifeYears=years, lifeInfinite=infinite, type=reg_type, securedParties=secured_parties, debtors=debtors,
        vehicleCollateral=vehicle_collateral, generalCollateral=general_collateral
    )
