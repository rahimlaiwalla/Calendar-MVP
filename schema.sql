DROP DATABASE IF EXISTS ride_share_calendar;

CREATE DATABASE ride_share_calendar;

\c ride_share_calendar;

CREATE TABLE locations_and_times (
    location_id SERIAL PRIMARY KEY,
    location_name TEXT NOT NULL,
    location_address TEXT NOT NULL,
    location_city TEXT NOT NULL,
    location_state TEXT NOT NULL,
    location_zip INT NOT NULL,
    weekday_start_time TEXT NOT NULL,
    friday_start_time TEXT NOT NULL,
    weekend_start_time TEXT NOT NULL
);

CREATE TABLE november (
    day_id SERIAL PRIMARY KEY,
    day INT NOT NULL,
    event_name TEXT
);

CREATE TABLE december (
    day_id SERIAL PRIMARY KEY,
    day INT NOT NULL,
    event_name TEXT
);

CREATE TABLE january (
    day_id SERIAL PRIMARY KEY,
    day INT NOT NULL,
    event_name TEXT
);

CREATE TABLE login (
  login_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NULL
);

CREATE TABLE userInfo (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL
      REFERENCES login(login_id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    day_id INT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    no_of_passengers INT,
    add_number INT NOT NULL,
    address TEXT NOT NULL,
    zip_code INT NOT NULL,
    longitude FLOAT(53) NOT NULL,
    latitude FLOAT(53) NOT NULL
);


COPY locations_and_times(location_name, location_address, location_city, location_state, location_zip, weekday_start_time, friday_start_time, weekend_start_time)
FROM '/Users/rahimlaiwalla/Hack Reactor/Calendar-MVP/csv files/locations_and_times.csv' DELIMITER ',' CSV;

COPY november(day, event_name)
FROM '/Users/rahimlaiwalla/Hack Reactor/Calendar-MVP/csv files/november.csv' DELIMITER ',' CSV;

COPY december(day, event_name)
FROM '/Users/rahimlaiwalla/Hack Reactor/Calendar-MVP/csv files/december.csv' DELIMITER ',' CSV;

COPY january(day, event_name)
FROM '/Users/rahimlaiwalla/Hack Reactor/Calendar-MVP/csv files/january.csv' DELIMITER ',' CSV;


-- insert into userInfo(day_id, name, status, no_of_passengers, add_number, address, zip_code) values (3, 'Rahim Laiwalla', 'driver', 3, 543, 'Howard St.', 94105);
-- insert into userInfo(day_id, name, status, no_of_passengers, add_number, address, zip_code) values (3, 'FN2 LN2', 'passenger', null, 543, 'Howard St.', 94105);
-- insert into userInfo(day_id, name, status, no_of_passengers, add_number, address, zip_code) values (3, 'FN3 LN3', 'passenger', null, 44, 'Tehama.', 94105);

insert into login (username, password) values ('User1', 'User1');
insert into login (username, password) values ('User2', 'User2');
insert into login (username, password) values ('User3', 'User3');
insert into login (username, password) values ('User4', 'User4');
insert into login (username, password) values ('User5', 'User5');
insert into login (username, password) values ('User6', 'User6');
insert into login (username, password) values ('User7', 'User7');
insert into login (username, password) values ('User8', 'User8');