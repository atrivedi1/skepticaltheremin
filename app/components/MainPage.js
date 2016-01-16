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
        userid: data.id
      }, function() {
          helpers.getAllStories(this.state.userid, function(data) {
            if (this.isMounted()) {
              this.setState({
                storyNames: data.storyName,
                storyPins: data.storyPins
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
    console.log(newStory, 'newStory');
    helpers.createNewStory(newStory, function(data) {
      this.getUserStory(data.id);
    }.bind(this));
  },


  render() {
    return (
      <div className='container'>
        <NavBar options={this.state} getUserStory={this.getUserStory} createStory = {this.createStory} />
        <MapApp storyPins={this.state.storyPins}/>
      </div>
    );
  }
});

module.exports = MainPage;
