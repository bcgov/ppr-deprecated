"""Module for date and datetime calculations."""

import datetime
import time

import pytz


PACIFIC_TZ = pytz.timezone('America/Vancouver')


def to_date_pacific(d: datetime):
    """Extract the date from the parameter according to the Pacific Timezone. Naive dates are first localized to UTC."""
    aware = pytz.utc.localize(d) if d.tzinfo is None else d
    pacific_datetime = aware.astimezone(PACIFIC_TZ)
    return pacific_datetime.date()


def today_pacific():
    """Get the current date based on the time in the Pacific Timezone."""
    now_pacific = datetime.datetime.fromtimestamp(time.time(), PACIFIC_TZ)
    return now_pacific.date()
