const resortFinder = require('./resortFinder');
const ResortInfo = require('../models/resortInfo');
const axios = require("axios");
const keys = require('../config/keys');
const { get } = require('mongoose');

exports.weatherInfo = async function (req, res, next) {
  // hardCode req.matchingPassIds for now
  req.matchingPassIds = [{"place_id":"ChIJ29swxmBwaocRoq1FSy3Pwqc"},{"place_id":"ChIJLUeXah54aocRLCubAYD6EBI"},{"place_id":"ChIJ5SL_Vd71aocRHD59U1wlA8s"},{"place_id":"ChIJW_aKIwJaaocRr6sP37eZJ_M"}];
// find and save coordinates for matching resorts
const resortQueries = req.matchingPassIds.map((element)=> {
  return ResortInfo.findOne({place_id: element.place_id}).exec();
})
const resorts = await Promise.all(resortQueries);
const idsAndCoordinates = resorts.map((resort, index) => {
  return { place_id: req.matchingPassIds[index].place_id, coordinates: resort.coordinates };
})
// declare function that handles weather data search, updates idsCoordinatesNWeatherReport to have place_id: String, coordinates: Object, weatherData: Object
  async function getWeatherData() {
    try {
      const weatherDataQueries = idsAndCoordinates.map((element) => {
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${element.coordinates.lat}&lon=${element.coordinates.lon}&appid=${keys.WEATHER_API_KEY}`);
      });
      const weatherDataResponses = await Promise.all(weatherDataQueries);
      const idsCoordinatesNWeatherReport = weatherDataResponses.map((response, index) => {
        return { place_id: idsAndCoordinates[index].place_id, coordinates: idsAndCoordinates[index].coordinates, weatherData: response.data };
      });
      res.json(idsCoordinatesNWeatherReport);
    } catch(err) { console.log(err); }
  }
  await getWeatherData();
};
/*
ToDo:
- Make weather data requests for every place returned from resortFinder:
  1) Run a search to database to retreive coordinates of matching place_id's passed with req.matchingPassIds;
  2) With the coordinates from previus step, request weather data for each location; decide which data points to use;
  3) Calculate "Gnar Score" based on the data choices from prevous step;
  4) Send data about gnar score and place_ids back to client for rendering on the front end;

 */