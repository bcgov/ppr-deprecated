INSERT INTO financing_statement (reg_number, reg_type_cd, status, life, expiry_date, trust, lien_value, surrender_date) VALUES
    ('123456A', 'SA', 'A', 7, now() + interval '7 years', false, null, null),
    ('123456B', 'SA', 'A', -1, null, true, null, null),
    ('234567R', 'RL', 'A', null, now() + interval '180 days', null, '1000', now() - interval '10 days');

INSERT INTO registration (reg_number, base_reg_number, change_type_cd, reg_date, life, document_number) VALUES
    ('123456A', '123456A', NULL, now(), 5, 'A0000001'),
    ('123456C', '123456A', NULL, now() + interval '1 hour', 2, 'A0000004'),
    ('123456B', '123456B', NULL, now(), -1, 'A0000002'),
    ('123456Z', '123456B', 'DT', now() + interval '1 hour', null, 'A0000003'),
    ('234567R', '234567R', NULL, now(), null, 'A0000005');

INSERT INTO vehicle (base_reg_number, reg_number_start, reg_number_end, vehicle_type_cd, mhr_number, year, make, model, serial_number) VALUES
    ('123456A', '123456A', null, 'MH', '123456', null, null, null, '67517679I8677863567654321'),
    ('123456B', '123456B', null, 'MH', '567890', null, null, null, null),
    ('123456A', '123456A', null, 'MV', null, 2103, 'Volkswagen', 'Tiguan', 'WVGBV7AX3DW537085'),
    ('123456B', '123456B', null, 'MV', null, 2003, 'Jeep', 'Wrangler', '1J4FA59S53P387692'),
    ('123456B', '123456B', '123456Z', 'MV', null, 2002, 'Toyota', 'Avalon', '4T1BF28B82U291010'),
    ('123456B', '123456Z', null, 'MV', null, 1998, 'Pontiac', 'Grand Prix', '1G2WP1211WF243800'),
    ('234567R', '234567R', null, 'MV', null, 2006, 'Jeep', 'Liberty', '1J4GL48K06W265262');

INSERT INTO general (base_reg_number, reg_number_start, reg_number_end, description, gc_ind) VALUES
    ('123456A', '123456A', null, 'An original description of general collateral', 1),
    ('123456B', '123456B', null, 'Everything in my kitchen except the sink', 1),
    ('123456B', '123456B', '123456Z', ', plus an additional line that was originally appended, but should now be ignored except on historical views.', 2),
    ('123456B', '123456Z', null, 'My sink should now be included', 1);

INSERT INTO address(addr_id, addr_line_1, addr_line_2, city, province, country_type_cd, postal_cd) VALUES
    (10000001, '123 Fake Street', 'Suite 100', 'Victoria', 'BC', 'CA', 'V1V 1V1'),
    (10000002, '742 Evergreen Terrace', null, 'Springfield', 'CA', 'US', '54321'),
    (10000003, '742 Evergreen Terrace', null, 'Springfield', 'CA', 'US', '54321'),
    (10000004, '55 Cobblestone Rd', null, 'Bedrock', null, 'GB', 'A1 1AA'),
    (10000005, '345 Cave Stone Road', 'Apt 405', 'Hollyrock', 'BC', 'CA', 'V2V 2V2'),
    (10000006, '1000 Mammon Lane', null, 'Springfield', 'BC', 'CA', 'V3V 3V3'),
    (10000007, '321 Fake St', null, 'Victoria', 'BC', 'CA', 'V3V 3V3'),
    (10000008, '742 Evergreen Terrace', null, 'Springfield', 'CA', 'US', '54321'),
    (10000009, '1000 Mammon Lane', null, 'Springfield', 'BC', 'CA', 'V3V 3V3');

INSERT INTO fs_party (party_type_cd, base_reg_num, reg_number_start, reg_number_end, addr_id, first_name, middle_name, last_name, business_name, birthdate) VALUES
    ('RP', '123456A', '123456A', null, 10000002, 'Homer', 'Jay', 'Simpson', 'Mr. Plow', null),
    ('RP', '123456B', '123456B', '123456Z', 10000003, 'Homer', 'Jay', 'Simpson', 'Mr. Plow', null),
    ('DE', '123456B', '123456B', '123456Z', 10000001, 'George', null, 'Jetson', null, '2000-01-01'),
    ('SP', '123456B', '123456B', null, 10000006, 'Charles', 'Montgomery', 'Burns', null, null),
    ('RP', '123456B', '123456Z', null, 10000004, 'Flintstone', null, 'Fred', null, null),
    ('DE', '123456B', '123456Z', null, 10000005, 'Rubble', null, 'Barney', null, '1900-02-28'),
    ('RP', '234567R', '234567R', null, 10000008, 'Homer', 'Jay', 'Simpson', 'Mr. Plow', null),
    ('SP', '234567R', '234567R', null, 10000009, 'Charles', 'Montgomery', 'Burns', null, null),
    ('DE', '234567R', '234567R', null, 10000007, 'George', null, 'Jetson', null, '2000-01-01');
