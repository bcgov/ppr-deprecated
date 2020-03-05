INSERT INTO financing_statement (reg_number, reg_type_cd, status, life, expiry_date) VALUES
    ('123456A', 'SA', 'A', 5, now() + interval '5 years'),
    ('123456B', 'SA', 'A', -1, null);

INSERT INTO registration (reg_number, base_reg_number, change_type_cd, reg_date, life, document_number) VALUES
    ('123456A', '123456A', NULL, now(), null, 'A0000001'),
    ('123456B', '123456B', NULL, now(), null, 'A0000002'),
    ('123456Z', '123456B', 'DT', now() + interval '1 hour', null, 'A0000003');

INSERT INTO vehicle (base_reg_number, reg_number_start, vehicle_type_cd, mhr_number) VALUES
    ('123456A', '123456A', 'MH', '123456'),
    ('123456B', '123456B', 'MH', '567890');

INSERT INTO fs_party (party_type_cd, base_reg_num, reg_number_start, reg_number_end, first_name, middle_name, last_name) VALUES
    ('RP', '123456A', '123456A', null, 'Homer', 'Jay', 'Simpson'),
    ('RP', '123456B', '123456B', '123456Z', 'Homer', 'Jay', 'Simpson'),
    ('DE', '123456B', '123456B', '123456Z', 'George', null, 'Jetson'),
    ('SP', '123456B', '123456B', null, 'Charles', 'Montgomery', 'Burns'),
    ('RP', '123456B', '123456Z', null, 'Flintstone', null, 'Fred'),
    ('DE', '123456B', '123456Z', null, 'Rubble', null, 'Barney');

INSERT INTO general (base_reg_number, reg_number_start, reg_number_end, description) VALUES
    ('123456A', '123456A', null, 'An original description of general collateral'),
    ('123456B', '123456B', null, 'An original continual general collateral'),
    ('123456B', '123456B', '123456Z', 'An original general collateral that was removed on a follow-up event'),
    ('123456B', '123456Z', null, 'A new general collateral that was added on a secondary registration')
