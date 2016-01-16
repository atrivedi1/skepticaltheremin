//define requirements
var db = require('../models/config.js');

module.exports = {
  createPin: function(params, callback){
   //will need to add categories back in 
    var insertQueryString = "INSERT into pins(userid, storyid, location, latitude, longitude, comment, time) \
               VALUES($1, $2, $3, $4, $5, $6, $7)";
    var pinidQueryString = "SELECT id FROM pins WHERE userid=$1 AND storyid=$2 AND location=$3 AND latitude=$4 AND longitude=$5 AND comment=$6 AND time=$7";

    db.query(insertQueryString , params, function(err, results){
      if(err){
        return console.error(err);
      } else {
        console.log("successfully created pin");   
        //refactor if have time...don't know why params were not getting passed down    
        db.query(pinidQueryString, [params[0],params[1], params[2], params[3], params[4], params[5], params[6]], function(err, results){
            console.log(results.rows[0]);
            callback(err, results.rows[0]);
        }); 
      }
    });
  },

  updatePin: function(params, callback){
    var queryString = "UPDATE pins SET location=$2,latitude=$3,longitude=$4,comment=$5,time=$6 WHERE id=$1";
    db.query(queryString, params, function(err, results){
      console.log("RESULTS FROM CHANGING PIN -->", results);
      callback(err, results);
    });
  },

  removePin: function(params, callback){
    var queryString = "DELETE FROM pins WHERE id=$1";
    db.query(queryString, params, function(err, results){
      callback(err, results);
    });
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
     var storyNameQueryString = "SELECT id, name FROM stories WHERE userid=$1";
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
          });
        }
     });
  },
};

