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
