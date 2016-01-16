//define requirements
var db = require('../models/config.js');


module.exports = {

  createUser:  function(params, callback){
    //MVP approach, refactor when you get a chance...
    var checkQueryString = "SELECT username from users WHERE username = $1";
    var inputQueryString = "INSERT into users(username) VALUES($1)";
    var useridQueryString = "SELECT id from users WHERE username = $1";
    //check if username exists in db
    db.query(checkQueryString, params, function(err, results){
      if(err){
        return console.error(err);
      } else if(results.rows.length === 0){
        //if username does NOT exist, insert it...
          db.query(inputQueryString, params, function(err, results){
            if(err){
              return console.error(err);
            } else {
              console.log("sucessfully inputted data into db");
            }
          });
      }
    });
    //in all cases return id of user
    db.query(useridQueryString, params, function(err, results){
      console.log("userid of user in question-->",results.rows[0]);
      return callback(err, results.rows[0]);
    });
  },

  removeUser: function(params, callback){
    var queryString = "DELETE FROM users WHERE username = $1";
    db.query(queryString, params, function(err, results){
      callback(err, results);
    });
  }

  // var createFriend = function(params, callback){
  //   var queryString = "INSERT into users(username) VALUE (?)";
  //   db.query(queryString, params, function(err, results){
  //     callback(err, results);
  //   });
  // };

  // var removeFriend = function(params, callback){
  //   var queryString = "DELETE FROM users WHERE username = ?";
  //   db.query(queryString, params, function(err, results){
  //     callback(err, results);
  //   });
  };
