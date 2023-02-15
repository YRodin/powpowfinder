const mongoose = require('mongoose');
const {Schema} = mongoose;
const axios = require("axios");


const PassInfoSchema = new Schema({
  passName: String,
  resortAccessList: [{
    type: Schema.Types.ObjectId,
    ref: 'resortinfo'
  }], 
});
const PassInfoModel = mongoose.model('passinfo', PassInfoSchema);
module.exports = PassInfoModel;

