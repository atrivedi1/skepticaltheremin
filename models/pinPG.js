//require postgres node module
var pg = require('pg');
//define location of database server
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pathapp';
//connect new table to db server
var pins = new pg.Client(connectionString);
pins.connect();
//define columns in new table (including data types, and relationships with other tables in the database)
var query = pins.query('CREATE TABLE pins(id SERIAL PRIMARY KEY, userid integer REFERENCES users(id), storyid integer REFERENCES stories(id), categoryid integer REFERENCES categories(id), latitude real, longitutde real, text varchar(200))');
query.on('end', function() { pins.end(); });