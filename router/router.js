//define requirements
var controller = require('../controllers');

//////////////////////////////PLACEHOLDER FOR HELPER FUNCTION INTENDED TO HELP CLEAN UP REPEATED CODE BELOW/////////////////////

// var helperFuncToConnectRouterToControllers = function(req, res){
//   return function(controller, action){

//   };
// }


//the function below leverages the db controllers in order to process the different http requests from the client side;
//it is exported and called from the server.js file
module.exports = function(app){

///////////////////////////////////////////////////USER-RELATED REQUEST HANDLERS////////////////////////////////////////////////

  ////////LOGIN-RELATED HANDLERS////////////
  
  //signup

  //signin

  //logout
 

  ////////ADD/REMOVE USER HANDLERS//////////   
  //add user**
  //NOTE: will need to handle case where username is already in database
  app.post('/api/users', function (req, res) {
    console.log("trying to add new user");
    //define value to be added to the database
    var username = [req.body.username];
  
    //call addUser method in user controller
    controller.user.createUser(username, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(201);
      console.log(username, " successfully added to the db");
    });
  });

  //remove user 
  app.delete('/api/users', function (req, res) {
    console.log("trying to delete existing user");
    //define value to be removed from database 
    var username = [req.body.username];
    //call removeUser method in user controller
    controller.user.removeUser(username, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.status(200).send('goodbye ' + username + " we will miss you");
      console.log(username, " succesfully deleted from db");
    });
  }); 

  ////////ADD/REMOVE FRIEND HANDLERS///////////

  //add friend

  //remove friend


///////////////////////////////////////////////////STORY-RELATED REQUEST HANDLERS////////////////////////////////////////////////

  //create story**
  app.post('/api/story', function (req, res) {
    console.log("trying to create a story");
    var storyData = [req.body.username, req.body.category, req.body.storyName];
    controller.story.createStory(storyData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(201);
      console.log("successfully enabling user to create a story");
    });
  }); 


  //update story**
  // app.put('/api/story/:id', function (req, res) {
  //   console.log("trying to update a story");
  //   var pinData = req.body.map(function(pinObject){
  //     return [Number(req.params.id), pinObject.categoryid, pinObject.location, pinObject.latitude, pinObject.longitude, pinObject.comment, pinObject.time];
  //   });
  //   controller.story.updateStory(pinData, function(err, data){
  //      if (err) {
  //       return console.error(err);
  //     }
  //     res.sendStatus(200);
  //     console.log("succesfully enabling user to edit story");
  //   });
  // }); 

  //view a story (personal or a friend's)
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


  //view all stories (personal or friend's)
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


  //remove story
  // app.delete('/api/story/:storyid', function (req, res) {
  //   console.log("trying to delete an existing story");
  //   var storyID = [Number(req.params.storyid)];
  //   controller.user.removeStory(username, function(err, data){
  //      if (err) {
  //       return console.error(err);
  //     }
  //     res.end();
  //     console.log("successfully deleted story from db");
  //   });
  // });

///////////////////////////////////////////////////PIN-RELATED REQUEST HANDLERS////////////////////////////////////////////////

  //add pin
  app.post('/api/pin/:storyid', function (req, res) {
    console.log("adding a pin");
    var pinData = [req.body.userid, Number(req.params.storyid), req.body.location, req.body.latitude, req.body.longitude, req.body.comment, req.body.time];
    controller.pin.createPin(pinData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(201);
      console.log("successfully added a pin");
    });
  });

  //edit pin
  // app.put('/api/pin/:storyid', function (req, res) {
  //   console.log("adding a pin");
  //   var pinData = [req.body.userid, Number(req.params.storyid), req.body.location, req.body.latitude, req.body.longitude, req.body.comment, req.body.time];
  //   controller.pin.createPin(pinData, function(err, data){
  //      if (err) {
  //       return console.error(err);
  //     }
  //     res.sendStatus(201);
  //     console.log("successfully added a pin");
  //   });
  // });


  //remove pin
  app.delete('/api/pin/:id', function (req, res) {
    console.log("deleting a pin");
    var pinData = [req.body.username, req.body.category, req.body.storyName];
    controller.story.viewStories(storyData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(200);
      console.log("successfully deleted pin");
    });
  });


  };



