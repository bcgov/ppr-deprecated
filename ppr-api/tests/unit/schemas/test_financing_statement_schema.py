import pytest

import schemas.financing_statement


def test_financing_statement_years_not_integer():
    try:
        schemas.financing_statement.FinancingStatementBase(years='25s', type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since type was invalid')


def test_financing_statement_years_integer_over_25():
    try:
        schemas.financing_statement.FinancingStatementBase(years=28, type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_integer_under_1():
    try:
        schemas.financing_statement.FinancingStatementBase(years=-1, type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_no_value_provided():
    financing_statement = schemas.financing_statement.FinancingStatementBase(years=None, type='SA', securedParties=[],
                                                                             debtors=[], vehicleCollateral=[],
                                                                             generalCollateral=[])
    assert financing_statement.years is None


def test_financing_statement_years_valid():
    financing_statement = schemas.financing_statement.FinancingStatementBase(years=25, type='SA', securedParties=[],
                                                                             debtors=[], vehicleCollateral=[],
                                                                             generalCollateral=[])
    assert financing_statement.years == 25
