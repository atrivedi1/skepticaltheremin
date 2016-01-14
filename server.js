//define requirements
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

//apply middleware
//NOTE: will need to change this route once we redo the file structure
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
    
//set up routes
//NOTE: will need to change this route once we redo the file structure
require('./router/router.js')(app);

//set up ports
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Server listening on port ' + port);
});  

module.exports = app;
