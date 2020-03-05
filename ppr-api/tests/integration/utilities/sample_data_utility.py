import datetime
import time

import datedelta
import sqlalchemy.orm

import models.collateral
import models.database
import models.financing_statement
import models.payment
import models.party
import models.search
import schemas.financing_statement
import schemas.payment


def create_test_financing_statement(**kwargs):
    options = dict({
        'type_code': schemas.financing_statement.RegistrationType.SECURITY_AGREEMENT.value,  # RegistrationType value
        'num_of_events': 1,
        'years': -1,  # An int for 1 to 25, or -1 for Infinity
        'registering_party': None,  # a dict with keys first_name, middle_name & last_name
        'general_collateral': []  # a list of str
    }, **kwargs)

    db = models.database.SessionLocal()
    try:
        reg_num = next_reg_number(db)
        life = options['years']
        expiry = datetime.date.today() + datedelta.datedelta(years=options['years']) if life > 0 else None
        fin_stmt = models.financing_statement.FinancingStatement(
            registration_type_code=options['type_code'], registration_number=reg_num, status='A',
            life_in_years=options['years'], expiry_date=expiry
        )
        event = models.financing_statement.FinancingStatementEvent(registration_number=reg_num)
        fin_stmt.events.append(event)

        if options['registering_party']:
            reg_party_input = options['registering_party']
            reg_party = models.party.Party(
                type_code='RP', first_name=reg_party_input['first_name'], last_name=reg_party_input['last_name'],
                middle_name=reg_party_input['middle_name'] if 'middle_name' in reg_party_input else None
            )
            fin_stmt.parties.append(reg_party)
            event.starting_parties.append(reg_party)

        for description in options['general_collateral']:
            collateral = models.collateral.GeneralCollateral(description=description)
            fin_stmt.general_collateral.append(collateral)
            event.starting_general_collateral.append(collateral)

        # Add additional events if needed
        for n in range(1, options['num_of_events']):
            fin_stmt.events.append(
                models.financing_statement.FinancingStatementEvent(registration_number=next_reg_number(db))
            )

        db.add(fin_stmt)
        db.commit()

        return retrieve_financing_statement_record(fin_stmt.registration_number)
    finally:
        db.close()


def create_test_financing_statement_event(fin_stmt: models.financing_statement.FinancingStatement, **kwargs):
    options = dict({
        'change_type_code': None,  # A 2 character string, a RegistrationType value
        'registering_party': None,  # a dict with keys first_name, middle_name & last_name
        'general_collateral': None  # a list of str
    }, **kwargs)

    db = models.database.SessionLocal()
    try:
        reg_num = next_reg_number(db)
        event = models.financing_statement.FinancingStatementEvent(registration_number=reg_num,
                                                                   change_type_code=options['change_type_code'])
        fin_stmt.events.append(event)

        reg_party_input = options['registering_party']
        if reg_party_input:
            existing_party = fin_stmt.get_registering_party()
            if existing_party:
                event.ending_parties.append(existing_party)

            reg_party = models.party.Party(
                type_code='RP', first_name=reg_party_input['first_name'], last_name=reg_party_input['last_name'],
                middle_name=reg_party_input['middle_name'] if 'middle_name' in reg_party_input else None
            )
            fin_stmt.parties.append(reg_party)
            event.starting_parties.append(reg_party)

        if options['general_collateral'] is not None:
            for existing_collateral in fin_stmt.general_collateral:
                event.ending_general_collateral.append(existing_collateral)
            for description in options['general_collateral']:
                collateral = models.collateral.GeneralCollateral(description=description)
                fin_stmt.general_collateral.append(collateral)
                event.starting_general_collateral.append(collateral)

        time.sleep(0.001)  # Ensure time has advanced since the previous event
        db.add(fin_stmt)
        db.commit()

        return retrieve_financing_statement_record(fin_stmt.registration_number)
    finally:
        db.close()


def next_reg_number(db):
    return str(db.execute("SELECT nextval('reg_number_seq')").first()[0])


def create_test_search_record(type_code: str, criteria: dict, matches: list = [],
                              payment: schemas.payment.Payment = None):
    db = models.database.SessionLocal()
    try:
        search_rec = models.search.Search(type_code=type_code, criteria=criteria)
        if payment:
            search_rec.payment = models.payment.Payment(id=payment.id, method=payment.method, status=payment.status)
        db.add(search_rec)

        for reg in matches:
            search_rec.results.append(models.search.SearchResult(registration_number=reg, exact=True, selected=True))

        db.commit()
        db.refresh(search_rec)
        return search_rec
    finally:
        db.close()


def retrieve_search_record(search_id: int):
    db = models.database.SessionLocal()
    try:
        return db.query(models.search.Search).get(search_id)
    finally:
        db.close()


def retrieve_search_result_records(search_id: int):
    db = models.database.SessionLocal()
    try:
        return db.query(models.search.SearchResult).filter(models.search.SearchResult.search_id == search_id).all()
    finally:
        db.close()


def retrieve_financing_statement_record(base_reg_number: str):
    db = models.database.SessionLocal()
    try:
        query = db.query(models.financing_statement.FinancingStatement)\
            .options(sqlalchemy.orm.joinedload('events').joinedload('starting_parties'))\
            .options(sqlalchemy.orm.joinedload('parties'))\
            .options(sqlalchemy.orm.joinedload('general_collateral'))
        return query.get(base_reg_number)
    finally:
        db.close()
