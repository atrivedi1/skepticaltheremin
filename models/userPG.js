//require current connection to instance of postgres
var client = require('/dbconnection.js');

//define columns in new users table (including data types, and relationships with other tables in the database)
//NOTE: may need to drop table as oauth will make needing a password unnecessary 
var query = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, password VARCHAR(40) not null, username VARCHAR(40) not null)');
query.on('end', function() { client.end(); });