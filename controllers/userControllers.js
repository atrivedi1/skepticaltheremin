//define requirements
var db = require('../models/config.js');


module.exports = {

  createUser:  function(params, callback){
    console.log(params);
    var queryString = "INSERT into users(username) VALUES($1)"
    db.query(queryString, params, function(err, results){
      callback(err, results);
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
  // };
};