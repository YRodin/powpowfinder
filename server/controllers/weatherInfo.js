const resortFinder = require("./resortFinder");
const ResortInfo = require("../models/resortInfo");
const axios = require("axios");
const keys = require("../config/keys");
const { get } = require("mongoose");

exports.weatherInfo = async function (req, res, next) {
  // hardCode req.matchingPassIds for now
  req.matchingPassIds = [
    { place_id: "ChIJ29swxmBwaocRoq1FSy3Pwqc" },
    { place_id: "ChIJLUeXah54aocRLCubAYD6EBI" },
    { place_id: "ChIJ5SL_Vd71aocRHD59U1wlA8s" },
    { place_id: "ChIJW_aKIwJaaocRr6sP37eZJ_M" },
  ];
  // find and save coordinates for matching resorts
  const resortQueries = req.matchingPassIds.map((element) => {
    return ResortInfo.findOne({ place_id: element.place_id }).exec();
  });
  const resorts = await Promise.all(resortQueries);
  const idsAndCoordinates = resorts.map((resort, index) => {
    return {
      place_id: req.matchingPassIds[index].place_id,
      coordinates: resort.coordinates,
    };
  });
  // declare function that handles weather data search, updates idsCoordinatesNWeatherReport to have place_id: String, coordinates: Object, weatherData: Object
  async function getSnowAccumulationData() {
    /*
        date function considerations:
        - maximum date range is Nov 1st - April 1st (snow months)
        - it must check current date, and if current month is not not equal NOV or DEC, it has to set starting date's year as { current year - 1 }:
        - if current month equals Nov or Dec, then starting year must be set as current year, in all other cases starting year is {current year - 1}
        for example if today is 28th of February 2023, it has to set start date as Nov 1st 2022;
        if current date falls between April 1st and October 31st - starting date year is set with 
        {current year -1}
       */
    function getStartDate() {
      const now = new Date();
      // if current month is between december-oct (newYear inseason + offseason) - set start date as nov 1st of previous year
      if([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(now.getMonth())) {
        const sd = new Date((now.getFullYear()-1), 10, 1);
        const year = sd.getFullYear();
        const month = (sd.getMonth() + 1).toString().padStart(2, "0");
        const day = sd.getDate().toString().padStart(2, "0");
        const sdString = `${year}-${month}-${day}`;
        return sdString;
      // if current month is nov or dec, set start date as nov 1st of current year
      } else {
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        const sdString = `${year}-${month}-${day}`;
        return sdString;
      }
    };

    function getEndDate() {
      const now = new Date();
        // if current month is between apr-oct (offseason) - set end date as last date of season
      if ([3, 4, 5, 6, 7, 8, 9].includes(now.getMonth())) {
        const ed = new Date(now.getFullYear(), 2, 31);
        const year = ed.getFullYear();
        const month = (ed.getMonth() + 1).toString().padStart(2, "0");
        const day = ed.getDate().toString().padStart(2, "0");
        const edString = `${year}-${month}-${day}`;
        return edString;
        // if current month is (inseason) nov or dec, jan, feb or mar - set end date as current date
      } else {
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        const edString = `${year}-${month}-${day}`;
        return edString;
      }
    }

    try {
      const weatherDataQueries = idsAndCoordinates.map((element) => {
        return axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${element.coordinates.lat}&lon=${element.coordinates.lon}&appid=${keys.WEATHER_API_KEY}`
        );
      });
      const weatherDataResponses = await Promise.all(weatherDataQueries);
      const idsCoordinatesNWeatherReport = weatherDataResponses.map(
        (response, index) => {
          return {
            place_id: idsAndCoordinates[index].place_id,
            coordinates: idsAndCoordinates[index].coordinates,
            weatherData: response.data,
          };
        }
      );
      res.json(idsCoordinatesNWeatherReport);
      req.idsCoordinatesNWeatherReport = idsCoordinatesNWeatherReport;
      next();
    } catch (err) {
      console.log(err);
    }
  }
  await getSnowAccumulationData();
};
/*
ToDo:
- Make weather data requests for every place returned from resortFinder:
  1) Write a function that returns dates for api search: we need Nov 1st as a starting point  and current date as a ending date of snow accumulation. Keep in mind that if today's date is past devember 31, starting point will have to have a year = current year -= 1.
  2) With the coordinates from previus step, request weather data for each location; decide which data points to use;
  3) Calculate "Gnar Score" based on the data choices from prevous step;
  4) Send data about gnar score and place_ids back to client for rendering on the front end;

 */
