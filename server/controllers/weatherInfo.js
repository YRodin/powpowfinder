const resortFinder = require("./resortFinder");
const ResortInfo = require("../models/resortInfo");
const axios = require("axios");

 // following function makes request to DB with pace_id's passed from req.matchingPassIds, and returns array of objects, one for each matching resort {place_id: String, coordinates: {lat, lon}}
async function getIdsNCoord4MatchingResorts(req, res) {
  try {
    const resortQueries = req.matchingPassIds.map((element) => {
      return ResortInfo.findOne({ place_id: element.place_id }).exec();
    });
    console.log(`res.headersSent is ${res.headersSent} @ line 13`);
    const resorts = await Promise.allSettled(resortQueries);
    console.log(`res.headersSent is ${res.headersSent} @ line 15`);
    console.log(`these are resorts DB`);
    console.log(resorts);
    const idsAndCoordinatesFromDb = resorts.map((resort, index) => {
      return {
        place_id: req.matchingPassIds[index].place_id,
        coordinates: resort.value.coordinates,
      };
    });
    return idsAndCoordinatesFromDb;
  } catch (err) {
    console.log(err);
  }
};
 // following function handles weather data search, returns array idsCoordinatesNSnowTotals with objects containing: place_id: String, coordinates: Object, snowfallSumm: Number
async function getSnowAccumulationData(idsAndCoordinates) {
  // this function sets proper start date for snow accumulation api call
  function getStartDate() {
    const now = new Date();
    // if current month is between december-oct (newYear inseason + offseason) - set start date as nov 1st of previous year
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(now.getMonth())) {
      const sd = new Date(now.getFullYear() - 1, 10, 1);
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
  }
  // this function sets proper end date for snow accumulation api call
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
  // this function sums up seasonal snow accumulation
  function snowfallSumm(array) {
    return array.reduce((acc, val) => {
      if (typeof val === "number" && !isNaN(val)) {
        return acc + val;
      } else {
        return acc;
      }
    }, 0);
  }
  //
  try {
    const weatherDataQueries = idsAndCoordinates.map((element) => {
      return axios.get(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${
          element.coordinates.lat
        }&longitude=${
          element.coordinates.lon
        }&start_date=${getStartDate()}&end_date=${getEndDate()}&daily=snowfall_sum&timezone=America%2FNew_York&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`
      );
    });
    const weatherDataResponses = await Promise.allSettled(weatherDataQueries);
    const idsCoordinatesNSnowTotals = weatherDataResponses.map(
      (response, index) => {
        return {
          place_id: idsAndCoordinates[index].place_id,
          coordinates: idsAndCoordinates[index].coordinates,
          snowfallSumm: snowfallSumm(response.value.data.daily.snowfall_sum),
        };
      }
    );
    return idsCoordinatesNSnowTotals;
  } catch (err) {
    console.log(err);
  }
};
exports.weatherInfo = async function (req, res, next) {
  const idsAndCoordinates = await getIdsNCoord4MatchingResorts(req, res);
  const data = await getSnowAccumulationData(idsAndCoordinates);
  res.send(data);
};
