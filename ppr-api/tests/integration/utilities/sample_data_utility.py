import datetime

import datedelta
import sqlalchemy.orm

import models.database
import models.financing_statement
import models.payment
import models.search
import schemas.financing_statement


def create_test_financing_statement(**kwargs):
    options = dict({
        'type_code': schemas.financing_statement.RegistrationType.SECURITY_AGREEMENT.value,
        'num_of_events': 1,
        'years': -1
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

        # Add additional events if needed
        for n in range(1, options['num_of_events']):
            fin_stmt.events.append(
                models.financing_statement.FinancingStatementEvent(registration_number=next_reg_number(db))
            )

        db.add(fin_stmt)
        db.commit()
        db.refresh(fin_stmt)
        fin_stmt.events  # Explicitly lazy load the events before closing the session
        return fin_stmt
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
        query = db.query(models.financing_statement.FinancingStatement).options(sqlalchemy.orm.joinedload('events'))
        return query.get(base_reg_number)
    finally:
        db.close()
