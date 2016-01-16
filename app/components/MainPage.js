var React = require('react');
var NavBar = require('./NavBar');
var MapApp = require('./MapApp');
var helpers = require('../utils/helpers');

var MainPage = React.createClass({
  getInitialState: function() {
    // makes a get request to server user story data
    // var state = GET request to server sending user array of objects [{}, {}, {}] { storyNames:['Hello', 'World'] };
    return {};
  },

  componentDidMount: function() {
    helpers.getUserID(function(data) {
      this.setState({
        userID: data.id
        // userID: 1
      }, function() {
          console.log(this.state.userID, 'userID');
          helpers.getAllStories(this.state.userID, function(data) {
            if (this.isMounted()) {
              this.setState({
                storyNames: data.storyName,
                pins: data.storyPins
                }
              );
            }

          }.bind(this));
      });
    }.bind(this));
  },

  getUserStory: function(storyID) {
    helpers.getSingleStory(storyID, function(data) {
      console.log(data);

      this.setState({
        storyPins: data
      }, function() {console.log(this.state);});
    }.bind(this));
  },

  createStory: function(newStory) {
    helpers.createNewStory(newStory, function(data) {
      this.setState({
        storyID: data.id,
      }, function() {
        this.getUserStory(data.id);
      }.bind(this));
    }.bind(this));
  },

  deletePin: function(id){
    alert('deleting pins from MainPage');
    var array = [];

   // Delete it from the database
   // helpers.deletePinRequest(id);

    var pinList = this.state.pins;
   
    for(var i = 0; i <pinList.length; i++){ 
      var pin = pinList[i];

      if(pin.pinID !== id){
        array.push(pin);  
      } else {
        console.log('Deleting', pin.pinID);
      }
    }

    this.setState({pins:array});
  
  },


  addStoryPin: function(pin, cb){
   // Send to database

   // $.ajax({
   //   url: '/api/maps/' + username,
   //   type: 'POST',
   //   success: function(data) {
   //     // this.setState({data: data});
   //     console.log(data);
   //     return cb(data);
   //   },
   //   error: function(xhr, status, err) {
   //     console.log(status, err.toString());
   //   }


    this.state.pins.push(pin);
    this.setState({ pins: this.state.pins });
    cb();

  },

  updateComment: function(pinID, comment){
     // Move this to helper function if time
   
   // $.ajax({
   //   url: '/api/maps/' + username,
   //   type: 'POST',
   //   success: function(data) {

   //     var updateStateArray = this.state.pins.map(function(pin){
   //       if(pin.pinID === pinID){
   //         pin.comment = comment;
   //       }
   //     });
   //     this.setState({pins:updateStateArray});
   //   },
   //   error: function(xhr, status, err) {
   //     console.log(status, err.toString());
   //   }

    var updateStateArray = this.state.pins.map(function(pin){
      if(pin.pinID === pinID){
        pin.comment = comment;
      }
    });
    alert('changed');
    this.setState({pins:updateStateArray});

  },


  render() {
    return (
      <div className='container'>
        <NavBar options={this.state} getUserStory={this.getUserStory} createStory = {this.createStory} />
        <MapApp 
          storyPins={this.state.pins} 
          storyID={this.state.storyID} 
          storyName={this.state.storyName} 
          userID={this.state.userID}  
          addStoryPin={this.addStoryPin} 
          deletePin={this.deletePin}
          updateComment={this.updateComment}/>
      </div>
    );
  }
});

module.exports = MainPage;
