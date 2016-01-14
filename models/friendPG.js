//require postgres node module
var pg = require('pg');
//define location of database server
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pathapp';
//connect new table to db server
var friends = new pg.Client(connectionString);
friends.connect();
//define columns in new table (including data types, and relationships with other tables in the database)
var query = friends.query('CREATE TABLE friends(userID integer PRIMARY KEY REFERENCES users(id), friendID integer REFERENCES users(id))');
query.on('end', function() { friends.end(); });