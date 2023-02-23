const google = require('@googlemaps/google-maps-services-js');
const User = require('../models/user');
const ResortInfo = require('../models/resortInfo');
const keys = require("../config/dev");


exports.resortFinder = async(req, res, next) => {
  const client = new Client({});
  //make initial request for location
  const location = { latitude: req.body.coordinates.lat, longitude: req.body.coordinates.lon}
  const request = {
    params: 
    {
      location,
      type: 'lodging',
      lodging_subtype: 'snow_ski',
      language: 'en',
      region: 'us',
      radius: req.body.radius,
      fields: ['name', 'geometry'],
      key: keys.GOOGLE_API_KEY,
    }
  };
  const response4UserSelection = {}; 
  try {
    response4UserSelection = await client.placesNearby(request);
    console.log(response4UserSelection.data);
  } catch (err) {
    console.log(err);
  }
  res.send('test');
}
/*

Todo:
1. Pass client req.body.query string to placesService() and retrieve data for the client's point of interest; in this first request we're looking for following fields: [name, geometry]. 
2. Request placesService() with following props inside request obj:
  - location(takes google.maps.LatLng('lat','lng'))
  - radius (numeric(metric), req.body.radius)
  - fields: place_id
3. Find places with matching id's in our db and get snow accumulation data and forecast data for records with mathing id's
4. write some logic that creates a "Gnar Score" for each resort;
5. display result as a map and a list of resorts;
*/


// example of using @googlemaps/google-maps-services-js for a request for ski resorts in specified radius and previously saved coordinates