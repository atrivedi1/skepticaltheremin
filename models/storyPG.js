//require current connection to instance of postgres
var client = require('dbconnection.js');

//define columns in new table (including data types, and relationships with other tables in the database)
var query = client.query('CREATE TABLE stories(id SERIAL PRIMARY KEY, userid integer REFERENCES users (id), categoryid integer REFERENCES categories(id))');
query.on('end', function() { client.end(); });