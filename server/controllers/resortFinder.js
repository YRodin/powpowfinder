const google = require('@google/maps');
const User = require('../models/user');
const ResortInfo = require('../models/resortInfo');
const keys = require("../config/dev");
const { map } = require('cheerio/lib/api/traversing');

exports.resortFinder = async(req, res, next) => {
  const placesService = new google.maps.places.PlacesService(map);
  const request = {
    query: req.body.query,
    fields: ['name', 'geometry'],
    location: ',',
    radius: req.body.radius 
  }
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