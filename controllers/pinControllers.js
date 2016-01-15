//define requirements
var db = require('../models/config.js');

module.exports = {
	createPin: function(params, callback){
	  var queryString = "";
	  db.query(queryString, params, function(err, results){
	    callback(err, results);
	  });
	},

	removePin: function(params, callback){
	  var queryString = "";
	  db.query(queryString, params, function(err, results){
	    callback(err, results);
	  });
	}
};

