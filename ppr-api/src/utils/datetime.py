import datetime
import time

import pytz

PACIFIC_TZ = pytz.timezone('America/Vancouver')


def today_pacific():
    now_pacific = datetime.datetime.fromtimestamp(time.time(), PACIFIC_TZ)
    return now_pacific.date()
