---------------------------------- Require Current Connection to Instance of Postgres --------------------------------
var db = require('../models/config.js');

---------------------------------------Create Each of the Tables Needed for the App-----------------------------------
--1. User Table

CREATE TABLE users(
	id SERIAL PRIMARY KEY, 
	username VARCHAR(40) not null
);

--2. Friend Table

CREATE TABLE friends(
	userID integer PRIMARY KEY REFERENCES users(id), 
	friendID integer REFERENCES users(id)
);

--3. Story Table

CREATE TABLE stories(
	id SERIAL PRIMARY KEY, 
	userid integer REFERENCES users (id), 
	categoryid integer REFERENCES categories(id), 
	name varchar(40)
);

--4. Category Table

CREATE TABLE categories(
	id SERIAL PRIMARY KEY, 
	name VARCHAR(40) not null
);

--5. Pin Table

CREATE TABLE pins(
	id SERIAL PRIMARY KEY, 
	userid integer REFERENCES users(id), 
	storyid integer REFERENCES stories(id), 
	categoryid integer REFERENCES categories(id), 
	location varchar(200),
	latitude real, 
	longitude real, 
	comment varchar(200),
	time integer
);

