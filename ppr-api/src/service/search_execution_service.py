import fastapi
import sqlalchemy.orm

import models.database
import schemas.collateral


MHR_SEARCH_SQL = """
SELECT reg_number
FROM registration r1
JOIN (
        SELECT base_reg_number as base_reg_number, max(reg_date) as max_reg_date
        FROM registration
        WHERE base_reg_number IN (
            SELECT base_reg_number
            FROM vehicle
            WHERE vehicle_type_cd = '{}' AND mhr_number = :mhr_number AND reg_number_end IS NULL
        )
        GROUP BY base_reg_number
    ) r2 ON r1.base_reg_number = r2.base_reg_number AND r1.reg_date = r2.max_reg_date
""".format(schemas.collateral.VehicleType.MANUFACTURED_HOME.value)


class SearchExecutionService:
    db: sqlalchemy.orm.Session

    def __init__(self, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
        self.db = session

    def find_registrations_for_mhr_number(self, mhr_number):
        results = self.db.execute(MHR_SEARCH_SQL, {'mhr_number': mhr_number})
        return list(map(lambda row: row[0], results))
