//define requirements
var db = require('../models/config.js');

module.exports = {
  createStory: function(params, callback){
    var insertQueryString = "INSERT into stories(userid, name) VALUES($1, $2)";
    var storyidQueryString = "SELECT id from stories WHERE name=$1";
    db.query(insertQueryString , params, function(err, results){
      if(err){
        return console.error(err);
      } else {
        console.log("successfully created story");   
        //refactor if have time...don't know why params were not getting passed down    
        db.query(storyidQueryString, [params[1]], function(err, results){
            console.log(results.rows[0]);
            callback(err, results.rows[0]);
        }); 
      }
    });

  },

  updateStory: function(params, callback){
    //eventually will want to add category here
    console.log("UPDATE PARAMS -->",params);
    var queryString = "UDPATE stories SET userid=$2 WHERE id=$1";
    db.query(queryString, params, function(err, results){
        callback(err, results);
    }); 
  },

  removeStory: function(params, callback){
    var pinsQueryString = "DELETE from pins WHERE storyid=$1";
    var storyQueryString = "DELETE from stories WHERE id=$1";
    db.query(pinsQueryString, params, function(err, results){
      if(err){
        return console.error(err);
      } else { 
        //refactor if have time...don't know why params were not getting passed down    
        db.query(storyQueryString, [params[0]], function(err, results){
            callback(err, results);
        }); 
      }
    });
  }

};

