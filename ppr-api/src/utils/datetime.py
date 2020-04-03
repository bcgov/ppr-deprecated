import datetime
import time

import pytz


PACIFIC_TZ = pytz.timezone('America/Vancouver')


def to_date_pacific(d: datetime):
    # if the date passed in is naive, localize it to UTC, then convert it to pacific to get the correct date
    aware = pytz.utc.localize(d) if d.tzinfo is None else d
    pacific_datetime = aware.astimezone(PACIFIC_TZ)
    return pacific_datetime.date()


def today_pacific():
    now_pacific = datetime.datetime.fromtimestamp(time.time(), PACIFIC_TZ)
    return now_pacific.date()
