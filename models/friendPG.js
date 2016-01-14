//require current connection to instance of postgres
var client = require('dbconnection.js');

//define columns in new table (including data types, and relationships with other tables in the database)
var query = client.query('CREATE TABLE friends(userID integer PRIMARY KEY REFERENCES users(id), friendID integer REFERENCES users(id))');
query.on('end', function() { client.end(); });