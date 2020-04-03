import datetime

import freezegun
import pytz

import utils.datetime


@freezegun.freeze_time('2020-02-22 00:00:01', tz_offset=0)
def test_today_pacific_early_utc_should_resolve_to_pacific_date():
    today = utils.datetime.today_pacific()
    assert today == datetime.date(2020, 2, 21)


@freezegun.freeze_time('2020-02-22 23:59:59', tz_offset=0)
def test_today_pacific_late_utc_should_remain_the_same():
    today = utils.datetime.today_pacific()
    assert today == datetime.date(2020, 2, 22)


@freezegun.freeze_time('2020-02-22 13:00:00', tz_offset=-8)
def test_today_pacific_early_pst_should_remain_the_same():
    today = utils.datetime.today_pacific()
    assert today == datetime.date(2020, 2, 22)


@freezegun.freeze_time('2020-02-22 23:59:59', tz_offset=-8)
def test_today_pacific_late_pst_should_remain_the_same():
    today = utils.datetime.today_pacific()
    assert today == datetime.date(2020, 2, 22)


def test_to_date_pacific_early_utc_should_resolve_to_pacific_date():
    date_in = datetime.datetime(2020, 2, 22, 0, 0, 1, tzinfo=pytz.utc)
    actual = utils.datetime.to_date_pacific(date_in)
    assert actual == datetime.date(2020, 2, 21)


def test_to_date_pacific_late_utc_should_remain_the_same():
    date_in = datetime.datetime(2020, 2, 22, 23, 59, 59, tzinfo=pytz.utc)
    actual = utils.datetime.to_date_pacific(date_in)
    assert actual == datetime.date(2020, 2, 22)


def test_to_date_pacific_early_pst_should_remain_the_same():
    date_in = datetime.datetime(2020, 2, 22, 0, 0, 1, tzinfo=utils.datetime.PACIFIC_TZ)
    actual = utils.datetime.to_date_pacific(date_in)
    assert actual == datetime.date(2020, 2, 22)


def test_to_date_pacific_late_pst_should_remain_the_same():
    date_in = datetime.datetime(2020, 2, 22, 23, 59, 59, tzinfo=utils.datetime.PACIFIC_TZ)
    actual = utils.datetime.to_date_pacific(date_in)
    assert actual == datetime.date(2020, 2, 22)


def test_to_date_pacific_early_naive_date_should_behave_as_utc():
    date_in = datetime.datetime(2020, 2, 22, 6, 0, 1)
    actual = utils.datetime.to_date_pacific(date_in)
    assert actual == datetime.date(2020, 2, 21)
