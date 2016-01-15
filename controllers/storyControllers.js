//define requirements
var db = require('../models/config.js');

module.exports = {
	createStory: function(params, callback){
	  var queryString = "INSERT into stories(userid, categoryid, name) \
	  					 VALUES((SELECT id FROM users WHERE username = $1),\
	  					 (SELECT id FROM categories WHERE name = $2), $3)";

	  db.query(queryString, params, function(err, results){
	    callback(err, results);
	  });
	},

	updateStory: function(params, callback){
	  //MVP...assuming there is a more efficient method here

	  var deleteQueryString = "DELETE from pins WHERE storyid = $1";
	  var updateQueryString = "INSERT into pins(storyid, categoryid, location, latitude, longitutde, comment, time)\
	  						   VALUES($1, $2, $3, $4, $5, $6, $7)";

	  //queries are by definition asynch, so need to nest if you want to do two queries one after another;
	  

	  db.query(deleteQueryString, [params[0][0]], function(err, results){
	  	console.log("successfully deleted");
	  });


	  params.forEach(function(storyToBeEdited){
	  	db.query(updateQueryString, storyToBeEdited, function(err, results){
	    	callback(err, results);
	  	});	  	
	  });

	},

	viewStory: function(params, callback){
	  var queryString = "";
	  db.query(queryString, params, function(err, results){
	    callback(err, results);
	  });
	},

	viewStories: function(params, callback){
	  var queryString = "";
	  db.query(queryString, params, function(err, results){
	    callback(err, results);
	  });
	},

	removeStory: function(params, callback){
	  var queryString = "";
	  db.query(queryString, params, function(err, results){
	    callback(err, results);
	  });
	}
}

