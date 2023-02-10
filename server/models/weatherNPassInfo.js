const mongoose = require('mongoose');
const {Schema} = mongoose;

const WpSchema = new Schema({
  PassName: String,
  ResortAccessList: Array,
});
const WeatherNPassModel = mongoose.model('weatherAndPassInfo', WpSchema);

module.exports = WeatherNPassModel;