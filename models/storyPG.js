//require postgres node module
var pg = require('pg');
//define location of database server
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pathapp';
//connect new table to db server
var stories = new pg.Client(connectionString);
stories.connect();
//define columns in new table (including data types, and relationships with other tables in the database)
var query = stories.query('CREATE TABLE stories(id SERIAL PRIMARY KEY, userid integer REFERENCES users (id), categoryid integer REFERENCES categories(id))');
query.on('end', function() { stories.end(); });