//define requirements
var controller = require('../controllers');
if (!process.env.APP_ID) {
  var config = require('../config.js');
};
var request = require('request');
var session = require('express-session');

////////////////////////////////////////////////////HELPER FUNCTIONS///////////////////////////////////////////////////////////

//function helps run queries against the User Table in the DB during oAUTH
var oauthHelperFuncThatReturnsUserID = function(username, session, cb){
  console.log("trying to add new user via oauth");
  //define value to be added to the database
  //call addUser method in user controller
  controller.user.createUser(username, function(err, data){
    if (err) {
      return console.error(err);
    }
    cb(data); 
  }); 
};


//the function below leverages the db controllers in order to process the different http requests from the client side;
//it is exported and called from the server.js file
module.exports = function(app){

///////////////////////////////////////////////////USER-RELATED REQUEST HANDLERS////////////////////////////////////////////////
 
  ////////LOGIN-RELATED HANDLERS////////////

  //DEFINE PARAMS FOR OAUTH
  var facebook_APP_ID = process.env.APP_ID || config.facebook.APP_ID;
  var facebook_CALLBACK_URI = process.env.CALLBACK_URI || config.facebook.CALLBACK_URI;
  var facebook_APP_SECRET = process.env.APP_SECRET || config.facebook.APP_SECRET;

  
  //SIGNIN
  app.get('/', function (req, res) {
   //check if a user already has a session 
   if (!req.session.user) {
     //if they do not, redirect them to the login page
     console.log('nothing for you!')
     res.redirect('login.html');
   } 
   //otherwise, get the user's  
   else {
    oauthHelperFuncThatReturnsUserID([req.session.user], req.session, function(data){
      req.session.userid = data;
      res.redirect('index.html');
    });
   }
   //and redirect user to the home page;
  });

  //OAUTH P1 (sending users to facebook for authentication)
  app.get('/auth/facebook', function (req, res) { 
   res.redirect('https://www.facebook.com/dialog/oauth?client_id=' + facebook_APP_ID  + '&redirect_uri=' + facebook_CALLBACK_URI);
  });

  //OAUTH P2 (facebook redirecting users back to our app after they've been authenticated)
  app.get('/facebook/callback/', function (req, res) {
   //this is a code provided by facebook verifying that user has a fb account and is logged in
   var code = req._parsedUrl.search.substring(6, req._parsedUrl.search.length);
   //define endpoint where app asks fb for user token
   var newEndpoint = 'https://graph.facebook.com/v2.3/oauth/access_token?client_id='+facebook_APP_ID+'&redirect_uri='+facebook_CALLBACK_URI+'&client_secret='+facebook_APP_SECRET+'&code='+code;
   
   //request token from fb @ endpoint
   request(newEndpoint, function (error, response, body) {
     //data coming from fb request
     var jsonBody = JSON.parse(body);
     //data body contains a token
     var myToken = jsonBody.access_token;
     //create route by which we can get userInfo from fb using token
     var toFindUser = 'https://graph.facebook.com/me?fields=name&access_token=' + myToken;
     //use token to get user's fb info
     request(toFindUser, function (error, response, body) {
       var userObj = JSON.parse(body);
       var name = userObj.name;
       //create session for user
       req.session.user = name;
       //once we have info and have created session, redirect user to app homepage AND send back userid;
       res.redirect('/');        
     });
   })
  });

  //PROVIDE USERID TO CLIENT WHEN THEY SIGN IN/ARE CREATED
  app.get('/userid', function(req, res){
    res.json(req.session.userid);
  });

  //LOGOUT
  app.get('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/');
    });
  });
 

  ///////////// OTHER USER HANDLERS//////////////

  //REMOVE USER
  app.delete('/api/users/:userid', function (req, res) {
    console.log("trying to delete existing user");
    //define value to be removed from database 
    var userID = [Number(req.params.userid)];
    //call removeUser method in user controller
    controller.user.removeUser(userID, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.status(200).send('goodbye ' + username + " we will miss you");
      console.log(username, " succesfully deleted from db");
    });
  }); 


///////////////////////////////////////////////////STORY-RELATED REQUEST HANDLERS////////////////////////////////////////////////

  //CREATE STORY**
  app.post('/api/story', function (req, res) {
    console.log("trying to create a story");
    var storyData = [req.body.userid, req.body.storyName];
    controller.story.createStory(storyData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.json(data);
      console.log("successfully enabling user to create a story");
    });
  }); 

  //UPDATE STORY**
  //NEED TO ASK SOMEONE ABOUT THIS...
  app.put('/api/story/:storyid', function (req, res) {
    console.log("trying to update a story");
    //eventually will want to add categoryName;
    var storyData = [Number(req.params.storyid), req.body.storyName];
    console.log("storyData -->", storyData);
    controller.story.updateStory(storyData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(200);
      console.log("succesfully enabling user to edit story");
    });
  }); 

  //VIEW STORY (personal or a friend's)
  app.get('/api/story/:storyid', function (req, res) {
    console.log("trying to view ONE story");
    var storyID = [Number(req.params.storyid)];
    controller.pin.viewStory(storyID, function(err, data){
       if (err) {
        return console.error(err);
      }
      //turns data into json;
      res.json(data.rows);
      console.log("successfully enabling user to view ONE story");
    });
  }); 


  //VIEW ALL STORIES (personal or friend's)
  app.get('/api/story/allstories/:userid', function (req, res) {
    console.log("trying to view ALL stories");
    var userID = [Number(req.params.userid)];
    controller.pin.viewStories(userID, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.json(data);
      console.log("successfully enabling user to view ALL stories");
    });
  });

  //REMOVE STORY
  app.delete('/api/story/:storyid', function (req, res) {
    console.log("trying to delete an existing story");
    var storyID = [Number(req.params.storyid)];
    controller.story.removeStory(storyID, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.end();
      console.log("successfully deleted story from db");
    });
  });

///////////////////////////////////////////////////PIN-RELATED REQUEST HANDLERS////////////////////////////////////////////////

  //ADD PIN
  app.post('/api/pin/:storyid', function (req, res) {
    console.log("adding a pin");
    var pinData = [req.body.userid, Number(req.params.storyid), req.body.location, req.body.latitude, req.body.longitude, req.body.comment, req.body.time];
    controller.pin.createPin(pinData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.json(data);
      console.log("successfully added a pin");
    });
  });

  //EDIT PIN
  app.put('/api/pin/:pinid', function (req, res) {
    console.log("editing a pin");
    var pinData = [Number(req.params.pinid), req.body.location, req.body.latitude, req.body.longitude, req.body.comment, req.body.time];
    controller.pin.updatePin(pinData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(200);
      console.log("successfully edit pin");
    });
  });

  //REMOVE PIN
  app.delete('/api/pin/:pinid', function (req, res) {
    console.log("deleting a pin");
    var pinID = [Number(req.params.pinid)];
    controller.pin.removePin(pinID, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(200);
      console.log("successfully deleted pin");
    });
  });


};


