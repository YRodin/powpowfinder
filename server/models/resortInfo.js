const mongoose = require('mongoose');
const {Schema} = mongoose;
const axios = require("axios");
const keys = require('../config/keys');

const ResortInfoSchema  = new Schema({
  city: String,
  state: String,
  coordinates: { lat: Number, lon: Number },
  pass: [{ type: Schema.Types.ObjectId, ref: 'passinfo' }]
});

ResortInfoSchema.methods.getCoordinates = async function (req, res, next) {
  try {
   const resposnse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${this.city},${this.state}}&limit=1&appid=${keys.WEATHER_API_KEY}`);
   this.coordinates.lat = resposnse.data.lat;
   this.coordinates.lon = resposnse.data.lon;
  } catch (err) {
    console.log(err.message);
  }
  };

const ResortInfoModel = mongoose.model('resortinfo', ResortInfoSchema);
module.exports = ResortInfoModel;