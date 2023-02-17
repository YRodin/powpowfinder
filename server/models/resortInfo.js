const mongoose = require("mongoose");
const { Schema } = mongoose;
const axios = require("axios");
const keys = require("../config/keys.js");

const ResortInfoSchema = new Schema({
  city: String,
  state: String,
  coordinates: { lat: Number, lon: Number },
  pass: [{ type: Schema.Types.ObjectId, ref: "passinfo" }],
});

//geocode and save each resort
ResortInfoSchema.methods.getCoordinates = async function (req, res, next) {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${this.city},${this.state}}&limit=1&appid=${keys.WEATHER_API_KEY}`
    );
    // check if response from OpenWeatherMap API for coordinates contains data and save it
    if (response.data.length > 0) {
      this.coordinates.lat = response.data[0].lat;
      this.coordinates.lon = response.data[0].lon;
      await this.save();
    } // else attempt to grab data from Google Geocoding API
    else {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.city},+${this.state}&key=${keys.GOOGLE_API_KEY}`
      );
      this.coordinates.lat = response.data.results[0].geometry.location.lat;
      this.coordinates.lon = response.data.results[0].geometry.location.lng;
      await this.save((err, updatedRecord) => {
        if (err) {
          next(err);
        } else {
          console.log(updatedRecord.coordinates);
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

const ResortInfoModel = mongoose.model("resortinfo", ResortInfoSchema);
module.exports = ResortInfoModel;
