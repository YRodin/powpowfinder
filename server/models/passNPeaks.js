const mongoose = require('mongoose');
const {Schema} = mongoose;

const PNPSchema = new Schema({
  passName: String,
  resortAccessList: Array,
});
const PassNPeaks = mongoose.model('passNPeaks', PNPSchema);

module.exports = PassNPeaks;