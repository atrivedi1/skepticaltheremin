var React = require('react');
// var Modal = require('./modal');
var helpers = require('../utils/helpers');

var Map = React.createClass({
  getInitialState(){

    var favorites = [];

    return {
      // Connected to the location input
      location: this.props.address,
      storyList:[],
      storyName: this.props.storyName,
      small:false,
      oldPins: this.props.oldPins,
      lat: this.props.lat,
      lng: this.props.lng,
      previousMarker: null,
      currentMarker: null,
      lastMarkerTimeStamp: null,
      map: null,
    }
  },
  
  // Change event from the location input
  handleLocationChange(e) {
    this.setState({location: e.target.value});  
  },
 
  // Grabs the comments from the comment textarea 
  handleCommentChange(e) {
    this.setState({comment: e.target.value});
  },

  // Handles the Stories changes
  handleStoryChange(e) {
    this.setState({"storyName": e.target.value})
  },

  matchBreadCrumb(timestamp){
    var breadcrumbs = this.props.favorites;
    for(var i = breadcrumbs.length - 1; i >= 0; i--){
      var breadcrumb = breadcrumbs[i];
      if(breadcrumb.timestamp === timestamp){
        this.setState({location: breadcrumb.location, comment: breadcrumb.details.note})
        return;
      }
    }

  },

  deletePin(id){
    console.log('DELETING PIN MAP.JS', id);
    this.props.deletePin(id);
  },




  // Loading all the old Pins from the database
  loadOldPins(maps){
    maps.removeMarkers();
    this.state.oldPins.forEach(function(pin){

      maps.addMarker({
        lat: pin.latitude,
        lng: pin.longitude,
        infoWindow:{
          content: `<div>
          <a>${pin.comment}</a> <br><br>
          <a data-pinid=${pin.pinID} class='delete'>Delete</a>
        </div>`
        },
        title: pin.location,
        click: function(e) {
          maps.setCenter(pin.latitude, pin.longitude);
        }
      });

    }.bind(this));


    // Since infoWindow is taken cared of by google
    // I have to use jquery here
    var self = this;

    $(document).on('click', '.delete', function(e){
      var id= $(this).data('pinid'); 
      self.deletePin(id);
      
      var pinList = self.state.oldPins
      // console.log("oldpin",pinList);

      var deletePin = _.find(pinList, function(pin){
        return pin.pinID === id;
      });
      // console.log(deletePin);
      var index = pinList.indexOf(deletePin);
      console.log(index);

      console.log("OLD PINS",pinList);
      self.setState({'oldPins': pinList.splice(index, 1) });
      console.log('NEW PINS',pinList);
      self.setState({'small':true})

    })
  },






  toggleFavorite(address){
    this.props.onFavoriteToggle(address);
  },

  addFavBreadCrumb(id, lat, lng, timestamp, details, infoWindow, location) {
    this.props.onAddToFavBcs(id, lat, lng, timestamp, details, infoWindow, location);
  },

  // Updating the markers
  updateCurrentLocation(){
    if(this.state.previousMarker){
      this.state.previousMarker.setIcon({
        // path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        // strokeColor: "red",
        // scale: 5
      });
    }
    this.state.currentMarker.setIcon({
      // path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      // strokeColor: "green",
      // scale: 5
    });
    this.state.previousMarker = this.state.currentMarker;
  },

  componentDidMount(){

    // Only componentDidMount is called when the component is first added to
    // the page. This is why we are calling the following method manually. 
    // This makes sure that our map initialization code is run the first time.

    // this.componentDidUpdate();
    var self = this;

    // This is creating the map and centering our code
    window.map = new GMaps({
      el: '#map',
      zoom:2,
      lat: this.props.lat,
      lng: this.props.lng,
      styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    });


    // This map is now attached to our state
    this.setState({ map: map },function(){
      
      // Once the state is loaded. LOAD THE PINS
      if(this.state.oldPins.length > 0){   
        // // Removes any markers on the map if their is any
        // if(map.markers.length > 0){
        //   self.removeMarkers(self.state.map);
        //   self.loadOldPins(self.state.map); 
        // } else {
        //   self.loadOldPins(self.state.map);
        // }
        // return;
        self.loadOldPins(self.state.map);
      } 
    });


    map.setCenter(this.props.lat, this.props.lng);

    // LOADING THE FUNCTION
    //Right Click Menu
    map.setContextMenu({
      control: 'map',
      options: [{
        title: 'Create Pin',
        name: 'Add Pin',


        // THIS FUNCTION IS CALLED ON A RIGHT CLICK
        action: function(e) {
          $("#myModal").modal();
          var addressString = e.latLng.lat().toString() + " " +  e.latLng.lng().toString();
          
          // UPDATE TO NEW LOCATION. RERENDERS THE PARENT COMPONENT WHICH THEN RERENDERS THIS COMPONENT UPDATING THE PROPS TO THE NEW RIGHT CLICKED LOCATION
          // PASSES THE LG AND LT TO SEARCHADDRESS IN MAPAPP
          // MAPAPP PASSES IT TO THIS FILE HERE AND PASSES IT TO THE LOCATION INPUT
          self.props.searchAddress(addressString, function(newLocation){
            // Were setting state inside here manually causing a re-render
            self.setState({location: newLocation, comment: "Add comments here and save breadcrumb"});         
          });



          // Time on when the map was clicked
          var time = Date.now();
          self.setState({lastMarkerTimeStamp: time});
          
          // When clicked it will always add a marker at this location
          var marker = this.addMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            title: 'New marker',
            timestamp: time,
            // icon: {
            //   path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            //   strokeColor: "green",
            //   scale: 5
            // },
            click: function(e) {
              self.setState({currentMarker: this});
              self.updateCurrentLocation();
            }
          });


          self.setState({currentMarker: marker});
          self.updateCurrentLocation();
        }
      }, {
        title: 'Center here',
        name: 'center_here',
        action: function(e) {
          console.log("fuck");
          this.setCenter(e.latLng.lat(), e.latLng.lng());
        }
      }]
    });

  },

  componentDidUpdate(){

    if(this.state.small){
      console.log("I got called");
      console.log('map',this.state.map)
      this.loadOldPins(window.map);
      this.setState({small: false});
    }

    // Just in case if things are not re-rendering
    if(this.props.oldPins.length !== this.state.oldPins.length){
      // console.log("I should be updating the map");
      // this.setState({oldPins: this.props.oldPins});
      // this.loadOldPins(this.state.oldPins);
    }

    // Update child Component
    if(this.state.location !== this.props.address){
      this.setState({location: this.props.address});
    }

    if(this.lastLat == this.props.center.lat && this.lastLng == this.props.center.lng){

      // The map has already been initialized at this address.
      // Return from this method so that we don't reinitialize it
      // (and cause it to flicker).
      return;
    }

    // Centering the app
    this.state.map.setCenter(this.props.center.lat, this.props.center.lng);
    this.lastLat = this.props.center.lat;
    this.lastLng = this.props.center.lng

  },



  persistPin(){

    // Get the lat and lng from MAP Apps SEARCH COMPONENT
    var lat = this.props.lat;
    var lng = this.props.lng;
    var timestamp = this.state.lastMarkerTimeStamp;
    var location = this.state.location;
    var comment = this.state.comment;
    var storyName = this.state.storyName;


    // Prepare the object and send it to the server
    // LAT AND LNG CAN BE EITHER FROM THE SEARCH COMPONENET OR FROM THE RIGHT CLICK FEATRUE FROM GMAPS. THIS IS BECAUSE SEARCHADRESS IS INVOKED
    var pinObject = {
      latitude: lat,
      longitutde: lng,
      time: timestamp,
      // The address for the pin
      location: location,
      // Comment relating to that pin
      comment: comment,
      // The stories name
      name: storyName
    };

    // Updating the state with the the pins that are making up a story
    this.setState({"storyList": this.state.storyList.push(pinObject) && this.state.storyList });
    
    // Closing the modal
    $("#myModal").modal('hide');

    //Adding a Pin on the Current Story
    this.state.map.addMarker({
      lat: lat ,
      lng: lng ,
      title: location,
      click: function(e) {
        alert('You clicked in this marker');
      }
    });


    if(this.state.storyList.length > 1){
      var storyList = this.state.storyList;

      var prevPin = storyList[storyList.length-2];

      this.state.map.drawRoute({
        origin: [prevPin.latitude, prevPin.longitutde ],
        destination: [lat, lng],
        travelMode: 'driving',
        strokeColor: '#131540',
        strokeOpacity: 1,
        strokeWeight: 6
      }); 
    }
    

    // Adding a story to our database
    this.props.addStoryPin(pinObject);

  },

  submitStory(){
    // Call the StoryList function
    //this.props.addNewStory(this.state.storyList);
    this.setState({location: '', comment: '', "storyName": '', "storyList": []});
  },


  render(){

    return (
      <div>
        <div className="map-holder">
          <p>Loading......</p>
          <div id="map"></div>
        </div>

        { /* Create Separate Component for this Model */ }
        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Modal Header</h4>
              </div>

              <div className="modal-body">

                <form className="form-group list-group" >
                  
                  <div class="form-group">
                    {/*Location */}
                    <label htmlFor="location">Location:</label>
                    <input type="text" className="form-control" id="location" onChange={this.handleLocationChange} value={this.state.location} placeholder="Location" />
                  </div>
                  
                  {/*
                    <div class="form-group">
                      Story Title
                      <label htmlFor="storyName"  >Story-Title:</label>
                      <input type="text" disabled={ this.state.storyList.length > 0 ? true : false } className="form-control" id="storyName" onChange={this.handleStoryChange} value={this.state.storyName} placeholder="Late Night Adventures" />
                    </div>
                  */}

                  <div class="form-group">
                    {/*Comment Box*/}
                    <label htmlFor="comment">Comment:</label>
                    <textarea value={this.state.comment} onChange={this.handleCommentChange} className="form-control" rows="10" id="comment"></textarea>
                  </div>
                </form>

              </div>

              <div className="modal-footer">
                <input type='button' onClick={this.persistPin} className='btn btn-success' value='Add New Story'/>
                <input type="button" onClick={this.submitStory} className="btn btn-primary" value="Sumbit Story" />
              </div>


            </div>

          </div>
        </div>


      </div>
    );
  }

});

module.exports = Map;
