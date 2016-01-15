//define requirements
var db = require('../models/config.js');

module.exports = {
  createPin: function(params, callback){
   //will need to add categories back in 
    var queryString = "INSERT into pins(userid, storyid, location, latitude, longitude, comment, time) \
               VALUES($1, $2, $3, $4, $5, $6, $7)";
    db.query(queryString, params, function(err, results){
      callback(err, results);
    });
  },

  removePin: function(params, callback){
    var queryString = "";
    db.query(queryString, params, function(err, results){
      callback(err, results);
    });
  },

  removeAllPins: function(params, callback){

  },

  viewStory: function(params, callback){
    var results = []; 
    var queryString = "SELECT * FROM pins WHERE storyid=$1";
    db.query(queryString, params, function(err, results){
      callback(err, results);
    });
  },

  viewStories: function(params, callback){
     var storyData = {}; 
     //set up queries for story and corresponding pin
     var storyNameQueryString = "SELECT name FROM stories WHERE userid=$1";
     var pinQueryString = "SELECT * FROM pins WHERE userid=$1";
     //handle query for story name
     db.query(storyNameQueryString, params, function(err, results){
        if(err){
          throw new Error(err);
        } else {
          storyData.storyName = results.rows;
          db.query(pinQueryString, params, function(err, results){
            if(err){
              throw new Error(err);
            } else {
              storyData.storyPins = results.rows;
              callback(null, storyData);
            }
          })
        }
     });
  },
};

