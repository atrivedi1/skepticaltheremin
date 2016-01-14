//require node postgres module
var pg = require('pg');

//define location of the db server
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pathapp';

//create new postgres instance 
var client = new pg.Client(connectionString);

//connect to the postgres instance
client.connect();

//export connection so that different tables/schemas can use it
module.exports = client; 