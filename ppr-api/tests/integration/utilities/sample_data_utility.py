import datetime
import time

import datedelta
import sqlalchemy.orm

import models.collateral
import models.database
import models.financing_statement
import models.party
import models.payment
import models.search
import schemas.financing_statement
import schemas.payment


def create_test_financing_statement(**kwargs):
    options = dict({
        'type_code': schemas.financing_statement.RegistrationType.SECURITY_AGREEMENT.value,  # RegistrationType value
        'num_of_events': 1,
        'years': -1,  # An int for 1 to 25, or -1 for Infinity
        'registering_party': None,  # a dict with keys first_name, middle_name, last_name, business_name & address
        'secured_parties': [],  # a list of dict with keys first_name, middle_name, last_name, business_name & address
        'debtors': [],  # a list of dict with keys first_name, middle_name, last_name, business_name & address
        'general_collateral': [],  # a list of str
        'vehicle_collateral': []  # a list of dict with keys type_code, year, make, model, serial_number & mhr_number
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
            add_test_party(fin_stmt, event, 'RP', **options['registering_party'])

        for secured_party_input in options['secured_parties']:
            add_test_party(fin_stmt, event, 'SP', **secured_party_input)

        for debtor_input in options['debtors']:
            add_test_party(fin_stmt, event, 'DE', **debtor_input)

        for description in options['general_collateral']:
            collateral = models.collateral.GeneralCollateral(description=description)
            fin_stmt.general_collateral.append(collateral)
            event.starting_general_collateral.append(collateral)

        for vehicle in options['vehicle_collateral']:
            collateral = models.collateral.VehicleCollateral(**vehicle)
            fin_stmt.vehicle_collateral.append(collateral)
            event.starting_vehicle_collateral.append(collateral)

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
        'registering_party': None,  # a dict with keys first_name, middle_name, last_name, business_name & address
        'secured_parties': None,  # a list of dict with keys first_name, middle_name, last_name, business_name & address
        'debtors': None,  # a list of dict with keys first_name, middle_name, last_name, business_name & address
        'general_collateral': None,  # a list of str
        'vehicle_collateral': None  # a list of dict with keys type_code, year, make, model, serial_number & mhr_number
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
            add_test_party(fin_stmt, event, 'RP', **reg_party_input)

        if options['secured_parties'] is not None:
            for existing_secured_party in fin_stmt.get_secured_parties():
                event.ending_parties.append(existing_secured_party)
            for secured_party_input in options['secured_parties']:
                add_test_party(fin_stmt, event, 'SP', **secured_party_input)

        if options['debtors'] is not None:
            for existing_debtor in fin_stmt.get_debtors():
                event.ending_parties.append(existing_debtor)
            for debtor_input in options['debtors']:
                add_test_party(fin_stmt, event, 'DE', **debtor_input)

        if options['general_collateral'] is not None:
            for existing_collateral in fin_stmt.general_collateral:
                event.ending_general_collateral.append(existing_collateral)
            for description in options['general_collateral']:
                collateral = models.collateral.GeneralCollateral(description=description)
                fin_stmt.general_collateral.append(collateral)
                event.starting_general_collateral.append(collateral)

        if options['vehicle_collateral'] is not None:
            for existing_collateral in fin_stmt.vehicle_collateral:
                event.ending_vehicle_collateral.append(existing_collateral)
            for vehicle in options['vehicle_collateral']:
                collateral = models.collateral.VehicleCollateral(**vehicle)
                fin_stmt.vehicle_collateral.append(collateral)
                event.starting_vehicle_collateral.append(collateral)

        time.sleep(0.001)  # Ensure time has advanced since the previous event
        db.add(fin_stmt)
        db.commit()

        return retrieve_financing_statement_record(fin_stmt.registration_number)
    finally:
        db.close()


def add_test_party(fin_stmt: models.financing_statement.FinancingStatement,
                   event: models.financing_statement.FinancingStatementEvent,
                   type_code: str, **kwargs):
    options = dict({
        'first_name': None,  # str
        'last_name': None,  # str
        'middle_name': None,  # str
        'business_name': None,  # str
        'birthdate': None,  # datetime.date
        'address': None  # dict with keys line1, line2, city, region, country, postal_code
    }, **kwargs)

    address = models.party.Address(**options['address']) if options['address'] else None
    debtor = models.party.Party(
        type_code=type_code, first_name=options['first_name'], last_name=options['last_name'],
        middle_name=options['middle_name'], business_name=options['business_name'], birthdate=options['birthdate'],
        address=address
    )
    fin_stmt.parties.append(debtor)
    event.starting_parties.append(debtor)


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
            .options(sqlalchemy.orm.joinedload('parties').joinedload('address'))\
            .options(sqlalchemy.orm.joinedload('general_collateral'))\
            .options(sqlalchemy.orm.joinedload('vehicle_collateral'))
        return query.get(base_reg_number)
    finally:
        db.close()
