import datetime

import freezegun

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
