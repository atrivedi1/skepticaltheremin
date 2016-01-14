///////////////////////////////SERVES AS A MAP FOR ALL OF THE CONTROLLER FILES//////////////////////////////////


//the module exports object below serves as a map of all of the controllers; it's currently being used by the
//server router.js file...
module.exports = {
  user: require('userControllers.js'),
  story: require('storyControllers.js'),
  pin: require('pinControllers.js')
};