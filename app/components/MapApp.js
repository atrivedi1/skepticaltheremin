var React = require('react');

var Search = require('./Search');
var Map = require('./Map');
var CurrentLocation = require('./CurrentLocation');
var LocationList = require('./LocationList');
var SearchUser = require('./SearchUser');
var helpers = require('../utils/helpers');
// var Signup = require('./Signup'); ** REMOVED




var MapApp = React.createClass({

  getInitialState(){

    // Extract the favorite locations from local storage
    var favorites = [];


    var storyPins = this.props.storyPins;
    var lng = storyPins[ storyPins.length-1 ].longitude;
    var lat = storyPins[ storyPins.length-1 ].latitude;


    return {
      // storyPins:storyPins,
      // This gets passed to the LocationList
      favorites: favorites,

      // On initial Page load Map is centerd with Hack Reactors Coordinates
      // Once the user adds something on the search bar, these values will begin to change
      currentAddress: '',
      mapCoordinates: {
        lat:'',
        lng:''
      },

      // Centering by the last Pin
      center: {
        lat: lat,
        lng: lng,
      }
      //storyID: this.props.storyID,
      //storyName: this.props.storyName
    };

  },



  componentDidMount(){

    // console.log('StoryPins',this.props.storyPins);
    // console.log('userID',this.props.userID);
    // console.log('storyID',this.props.storyID);
    // console.log('storyName', this.props.storyName);

    // If the story array has 0 pins then get the geocoordinates
    if(this.props.storyPins.length === 0){

      GMaps.geolocate.call(this, {
        success: function(position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          this.setState({
            mapCoordinates: {lat: lat , lng: lng } 
          });

          var addressString = this.state.mapCoordinates.lat + " " +  this.state.mapCoordinates.lng;

          this.searchForAddress(addressString, function(currentAddress){
            this.setState({"currentAddress": currentAddress});
            
            // Centering By geocode
            this.setState({'center': {lat: lat, lng: lng } });
            this.forceUpdate(); 
          }.bind(this), null);


        }.bind(this),

        error: function(error) {
          console.log('Geolocation failed: ' + error.message);
        },
        not_supported: function() {
          console.log("Your browser does not support geolocation");
        },
        always: function() {
          console.log("Done!");
        }
      });

    }



  },

  addNewStory(storyList, cb){
    var user = this.state.user;
    helpers.sendStory(user, storyList, cb);
  },

  addStoryPin(pin, cb){
    alert("I am in the MapApp");
    helpers.addPin(this.state.user, pin, cb);
  },

  deletePin(id){
    console.log("MapApp deleting PIN", id);
    helpers.deletePinRequest(id);
  },

  // // Adds a new breadCrumb to the database
  // addToFavBreadCrumbs(id, lat, lng, timestamp, details, location) {
  //   var favorites = this.state.favorites;
  //   var breadcrumb = {
  //     id: id,
  //     lat: lat,
  //     lng: lng,
  //     timestamp: timestamp,
  //     details: details,
  //     address: this.state.currentAddress,
  //     location: location
  //   };
  //   favorites.push(breadcrumb);

  //   // Render all components with the new favorites array
  //   this.setState({
  //     favorites: favorites
  //   });

  //   // ADDS THE BREADCRUMB TO OUR DATABASE
  //   helpers.addBreadCrumb(this.state.user, breadcrumb, function(data){
  //     console.log(data);
  //   });
  //   localStorage.favorites = JSON.stringify(favorites);

  // },

  // Whenever a user searches something from the Search Component, it will call this function
  searchForAddress(address, cb, recenter){
    var self = this;

    console.log("search called", address);

    // We will use GMaps' geocode functionality,
    // which is built on top of the Google Maps API

    GMaps.geocode({
      address: address,
      callback: function(results, status) {

        if (status !== 'OK') return;
        var latlng = results[0].geometry.location;

        // Coordinages based off the searchResults
        self.setState({
          currentAddress: results[0].formatted_address,
          mapCoordinates: {
            lat: latlng.lat(),
            lng: latlng.lng()
          }
        });

        //THIS IS ONLY GIVING THE DATA TO CENTER THE MAP!. This is not acutally centering the map
        if(recenter){
          self.setState({
            center: {
              lat: latlng.lat(),
              lng: latlng.lng()
            }
          });
        }

        // Passes in the exact address to the callback
        // Passing a callback allows us to rerender the component in which the callback was initiated in
        if(cb){
          cb(results[0].formatted_address); 
        }

      }
    });

  },

  render(){

      return (
        <div>

          <h1 className="col-xs-12 col-md-6 col-md-offset-3">My Breadcrumbs</h1>

          {/*The search results are extracted from this component and passed to the searchForAddress.*/}
          {/*The search Address only updates the current Coordinates.*/}
          <Search onSearch={this.searchForAddress} />

          {/*On Initial Page load everything points to Hack Reactors Coordinates*/}

          {/*Once a user searches for some location on the Search Componennt our Map component state will update its coordinates based off their search Results.*/}
          {/*Everything on this components state is passed in as a property to the Map Component*/}

          <Map 

            favorites={this.state.favorites}
            onFavoriteToggle={this.toggleFavorite}
            addStoryPin={this.addStoryPin}

            // Adding A Individual Story
            onAddToFavBcs={this.addToFavBreadCrumbs}
            searchAddress={this.searchForAddress}
            address={this.state.currentAddress} 
            center={this.state.center} 
            loginUser={this.loginUser}
            user={this.state.user} 


            lat={this.state.mapCoordinates.lat}
            lng={this.state.mapCoordinates.lng}
            userID={this.props.userID}
            storyID={this.props.storyID}
            oldPins={this.props.storyPins}
            deletePin={this.deletePin}
            addNewStory={this.addNewStory}
            storyName={this.state.storyName}

          />

          {/*Favorites is passed in to LocationList*/}
          {/*When the Favorites is changed it will rerun location list*/}
          <LocationList locations={this.state.favorites}
            activeLocationAddress={this.state.currentAddress} 
            onClick={this.searchForAddress} 
          />

        </div>

      );
    // ** REMOVED **
    // } else {
    //   return <Signup loginUser={this.loginUser}/>
    // }
  }

});

module.exports = MapApp;
