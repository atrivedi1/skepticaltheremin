//require postgres node module
var pg = require('pg');
//define location of database server
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pathapp';
//connect new table to db server
var categories = new pg.Client(connectionString);
categories.connect();
//define columns in new table (including data types, and relationships with other tables in the database)
var query = categories.query('CREATE TABLE categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null)');
query.on('end', function() { categories.end(); });