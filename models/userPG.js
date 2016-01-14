//require postgres node module	
var pg = require('pg');
//define location of database server
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pathapp';
//connect new table to db server
var users = new pg.Client(connectionString);
users.connect();
//define columns in new table (including data types, and relationships with other tables in the database)
//NOTE: may need to drop table as oath will 
var query = users.query('CREATE TABLE users(id SERIAL PRIMARY KEY, password VARCHAR(40) not null, username VARCHAR(40) not null)');
query.on('end', function() { users.end(); });