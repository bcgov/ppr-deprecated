import pytest

import schemas.financing_statement


def test_financing_statement_years_not_integer():
    try:
        schemas.financing_statement.FinancingStatementBase(lifeYears='25s', type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since type was invalid')


def test_financing_statement_years_integer_over_25():
    try:
        schemas.financing_statement.FinancingStatementBase(lifeYears=26, type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_integer_under_1():
    try:
        schemas.financing_statement.FinancingStatementBase(lifeYears=-1, type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_integer_0():
    try:
        schemas.financing_statement.FinancingStatementBase(lifeYears=0, type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_fraction():
    try:
        schemas.financing_statement.FinancingStatementBase(lifeYears=23.3, type='SA', securedParties=[], debtors=[],
                                                           vehicleCollateral=[], generalCollateral=[])
    except ValueError:
        pass
    else:
        pytest.fail('A validation error was expected since value provided was invalid')


def test_financing_statement_years_no_value_provided():
    financing_statement = schemas.financing_statement.FinancingStatementBase(lifeYears=None, type='SA',
                                                                             securedParties=[], debtors=[],
                                                                             vehicleCollateral=[], generalCollateral=[])
    assert financing_statement.lifeYears is None


def test_financing_statement_years_25():
    financing_statement = schemas.financing_statement.FinancingStatementBase(lifeYears=25, type='SA', securedParties=[],
                                                                             debtors=[], vehicleCollateral=[],
                                                                             generalCollateral=[])
    assert financing_statement.lifeYears == 25


def test_financing_statement_years_1():
    financing_statement = schemas.financing_statement.FinancingStatementBase(lifeYears=1, type='SA', securedParties=[],
                                                                             debtors=[], vehicleCollateral=[],
                                                                             generalCollateral=[])
    assert financing_statement.lifeYears == 1
