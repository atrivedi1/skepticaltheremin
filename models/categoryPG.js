//require current connection to instance of postgres
var client = require('dbconnection.js');

//define columns in new table (including data types, and relationships with other tables in the database)
var query = client.query('CREATE TABLE categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null)');
query.on('end', function() { client.end(); });