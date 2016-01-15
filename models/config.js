//require node postgres module
var pg = require('pg');

//define location of the db server
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pathapp';

//create new postgres instance 
var db = new pg.Client(connectionString);

//connect to the postgres instance
db.connect();

//for testing purposes...
// var query = db.query('CREATE TABLE friends(userID integer PRIMARY KEY REFERENCES users(id), friendID integer REFERENCES users(id))');
// var query = db.query('CREATE TABLE categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null)');
// var query = db.query('CREATE TABLE stories(id SERIAL PRIMARY KEY, userid integer REFERENCES users (id), categoryid integer REFERENCES categories(id), name varchar(40))');
// var query = db.query('CREATE TABLE pins(id SERIAL PRIMARY KEY, userid integer REFERENCES users(id), storyid integer REFERENCES stories(id), categoryid integer REFERENCES categories(id), location varchar(200),latitude real, longitutde real, comment varchar(200),time integer)');

//export connection so that different tables/schemas can use it
module.exports = db; 