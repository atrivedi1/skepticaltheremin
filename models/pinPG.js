//require current connection to instance of postgres
var client = require('dbconnection.js');

//define columns in new table (including data types, and relationships with other tables in the database)
var query = client.query('CREATE TABLE pins(id SERIAL PRIMARY KEY, userid integer REFERENCES users(id), storyid integer REFERENCES stories(id), categoryid integer REFERENCES categories(id), latitude real, longitutde real, text varchar(200))');
query.on('end', function() { client.end(); });