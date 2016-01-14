/////////////////////////////////////////////////////////OLD ROUTER CODE///////////////////////////////////////////////////////

//////////////////
//users 
//////////////////

//get all users. not usually useful
router.route('/users')
  .get(function (req, res) {
    console.log('user get')
    userController.getAll(function(err, person){
      if (err) {
        return res.json({err: err})
      }
      res.json(person)
    });
  });

//create user
router.route('/users')
  .post(function (req, res) {
    //example:
    console.log("post to /users", req.body.username,req.body.password);
    var newuser = {
      username: req.body.username,
      password: req.body.password,
      pins: []
    }

    userController.addUser(newuser, function(err, pins){
       if (err) {
        console.log(err);
        return res.json({err: err});
      }
      res.status(201).json(pins);
    });
  });

//delete user
router.route('/users')
  .delete(function (req, res) {
    userController.removeUser({username: req.body.username}, function(err, user){
       if (err) {
        return res.json({err: err});
      }
      res.json(user);
    });
  });

//////////////////
//pins
//////////////////

//get array of pins for single user
router.route('/maps/:username')
  .get(function (req, res) {
    var username = req.params.username;

    userController.findOne({username: username}, function(err, person){
      if (err) {
        return res.json({err: err})
      }
      //sends back entire person object currently. refactor to only the pins array
      res.json(person)
    });
  });

//insert new pin in pins array on user obj
router.route('/maps/:username')
  .put(function (req, res) {
    var username = req.params.username;
    var newpin = req.body;

    if(JSON.stringify(newpin) !== JSON.stringify({})){  
      userController.updatePins({username: username}, newpin, function(err, pins){
         if (err) {
          return res.json({err: err});
        }
        res.json(pins)

      });
    } else {
      res.json({})
    }


  });

// delete last pin from array
// router.route('/maps/:username')
//   .delete(function (req, res) {
//     var username = req.params.username;
//     userController.removeLastPin({userName: username}, function(err, pins){
//        if (err) {
//         return res.json({err: err});
//       }
//       res.json(pins);
//     });
//   });

//delete a spcific pin
router.route('/maps/:username')
  .delete(function (req, res) {
    var username = req.params.username;
    var pinId = req.body._id;
    userController.deletePin({username: username}, pinId, function(err, doc) {
      if (err) {
        return res.json({err: err});
      }
      res.json(doc);
    });
  });



module.exports = router;


/////////////////////////////////////////////////////////OLD USER CONTROLLER CODE///////////////////////////////////////////////////////



//****************************************************
//These controller functions are called by the router,
//and manipulate the database.
//****************************************************



//////////////////
//users controllers
//////////////////

//Adds a new user; called when api/users hears a post request.
exports.addUser = function(name, callback) {
  User.create(name, function (err, person) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, person);
  });
}

//Removes a user; called when api/users hears a delete request.
exports.removeUser = function(name, callback) {
  User.remove(name, function (err, person) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, person);
  });
}

//////////////////
//pins controllers
//////////////////

//find pins of single user
exports.findOne = function (query, callback) {
  User.findOne(query, function (err, person) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, person);
  });
};

//find user and add new pin to pins collection, one at a time
//called when api/maps/:username hears a put request
exports.updatePins = function (query, newPin, callback) {
  if(!newPin){
    return;
  } else {
    var pinToCreate = new Pin(newPin);
    User.findOneAndUpdate(query, {$push: {pins: pinToCreate}}, function (err, doc) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, pinToCreate);
    });
  }
};


//remove last pin: only used in testing
exports.removeLastPin = function (name, callback) {


  User.findOne(query, function (err, doc) {
    console.log('remove from database')
    if (err) {
      callback(err);
      return;
    }

    console.log('doc:', doc)
    if(doc){
      var poppedPin = doc.pins.pop();

      doc.save();
    }
    callback(null, poppedPin);
  
  });

};



//deletes a specific pin. called when api/maps/:username hears a delete reqest 
exports.deletePin = function (name, pinId, callback) {
  User.findOne(name, function (err, user) {
    console.log('trying to delete pin');
    for (var i = 0; i < user.pins.length; i++) {
      var pin = user.pins[i];
      if (pin._id == pinId) {
        user.pins = user.pins.slice(0, i ).concat(user.pins.slice(i+1));
        user.save();
        callback(err, pin);
      }
    }

  });
};

//get all people --for testing mostly
exports.getAll = function (callback) {
  User.find({}, function (err, persons) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, persons);
  });
};


//example pins
// [{"lat":37.78696217255432,"lng":-122.40696430206299,"timestamp":1452391665585,"details":{"note":"I LOVE this place."},"infoWindow":{"content":"<p>Dat info dohhh</p>"}},8

// {"lat":37.7865043039168,"lng":-122.40644931793213,"timestamp":1452391678701,"details":{"note":"I meh this place."},"infoWindow":{"content":"<p>llllalala</p>"}},
 

// {"lat":37.78613123179135,"lng":-122.40491509437561,"timestamp":1452394116848,"details":{"note":"I hate this place."},"infoWindow":{"content":"<p>skip skip</p>"}}]