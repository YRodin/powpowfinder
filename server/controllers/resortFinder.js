const User = require("../models/user");
const PassInfo = require("../models/passInfo");
const keys = require("../config/dev");
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require("axios");

exports.resortFinder = async (req, res, next) => {
  const client = new Client({});
  const location = { latitude: "", longitude: "" };
  const matchingPassIds = [];
  const userSearchResultPlaceIds = [];
  const userPassIds = [];
  // make initial request for location coordinates
  try {
    const response4UserSelection = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.city},+${req.body.state}&key=${keys.GOOGLE_API_KEY}`
    );
    location.latitude =
      response4UserSelection.data.results[0].geometry.location.lat;
    location.longitude =
      response4UserSelection.data.results[0].geometry.location.lng;
  } catch (err) {
    console.log(err);
  }
  // make a request for ski resorts near user selected town and radius; save place_id's in an array userSearchResultPlaceIds.
  const request = {
    params: {
      location,
      radius: req.body.radius,
      keyword: "ski resort",
      key: keys.GOOGLE_API_KEY,
      type: [
        'tourist_attraction',
        'lodging',
        'point_of_interest',
        'establishment'
      ]
    },
  };
  try {
    const userSearchResults = await client.placesNearby(request);
    userSearchResults.data.results.forEach((skiResort) => {
      userSearchResultPlaceIds.push({ place_id: skiResort.place_id });
    });
  } catch (err) {
    console.log(err);
  }
  // retreive ids of ski resorts available to user with their pass.
  try {
    const pass = await PassInfo.findOne({ passName: req.body.passName })
      .populate({
        path: "resortAccessList",
        select: "place_id",
      })
      .exec();
    pass.resortAccessList.forEach((resort) => {
      userPassIds.push({place_id: resort.place_id});
    });
    findMatchingIds();
  } catch (err) {
    console.log(err);
  }
  // compare search results to user selected ski pass and make weather requests for matching locations
  function findMatchingIds () {
    // console.log('this is user pass ids');
    // console.log(userPassIds);
    // console.log('this is userSearchResultPlaceIds');
    // console.log(userSearchResultPlaceIds);
    for (let i = 0; i < userPassIds.length; i++) {
      for (let m = 0; m < userSearchResultPlaceIds.length; m++) {
        if (userPassIds[i].place_id === userSearchResultPlaceIds[m].place_id) { 
          console.log(`there is a match`);
          matchingPassIds.push(userSearchResultPlaceIds[m]);
        } else { console.log('no matches again')}
      }
    }
  }
  res.send("test");
};
/*pas

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
