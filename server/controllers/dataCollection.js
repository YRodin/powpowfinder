const authentication = require("./authentication");
const PassInfoModel = require("../models/passInfo");
const axios = require("axios");
const cheerio = require("cheerio");
const ResortInfoModel = require("../models/resortInfo");

exports.getPassInfo = async function (req, res, next) {
  // axios call for html about season-pass-mountain-access data
  const passUrls = {
    epic: "https://epicorikon.com/",
    ikon: "https://epicorikon.com/",
    mountainCollective: "https://www.skimag.com/ski-resort-life/mountain-collective-details/",
    indy: "https://www.indyskipass.com/resorts/", //indy requires traversing further down dom tree to grab data
  };
  const passesAndPeaks = {};
  // get list of mouintains accessible to "Epic" season pass holders
  try {
    const peaksEpic = [];
    const response = await axios.get(passUrls.epic);
    const $ = cheerio.load(response.data);
    const ul = $("[aria-label='Full Access Epic Pass Resorts']").children("li");

    ul.each((index, element) => {
      const button = $(element).find("button");
      let cityNState = button.text().replace(/<!-- -->/g, "");
      cityNState = cityNState.split(", ");
      let city = cityNState[0].trim();
      let formattedState = cityNState[1].trim().slice(0, 2);
      peaksEpic.push({ city:city, state: formattedState });
    });
    passesAndPeaks.epic = peaksEpic;
  } catch (err) {
    console.log(err.message);
  }
  // get list of mouintains accessible to "Ikon" season pass holders
  try {
    const peaksIkon = [];
    const response = await axios.get(passUrls.ikon);
    const $ = cheerio.load(response.data);
    const ul = $("[aria-label='Full Access Ikon Pass Resorts']").children("li");

    ul.each((index, element) => {
      const button = $(element).find("button");
      let cityNState = button.html().replace(/<!-- -->/g, "");
      cityNState = cityNState.split(", ");
      let city = cityNState[0].trim();
      let formattedState = cityNState[1].trim().slice(0, 2);
      peaksIkon.push({ city:city, state: formattedState });
    });
    passesAndPeaks.ikon = peaksIkon;
  } catch (err) {
    console.log(err.message);
  }
  // get list of mouintains accessible to "MountainCollective" season pass holders
  try {
    const peaksMountainCollective = [];
    const response = await axios.get(passUrls.mountainCollective);
    const $ = cheerio.load(response.data);
    const h3 = $('h3:contains("United States")');
    const ul = h3.next("ul").children('li');
    ul.each((index, li) => {
      let cityAndState = $(li).text();
      [city, state] = cityAndState.split(',');
      peaksMountainCollective.push({ city: city.trim(), state: state.trim().replace(/ .*/g, "")});
    })
    passesAndPeaks.mountainCollective = peaksMountainCollective;
  } catch (err) {
    console.log(err);
  }
  // get list of mouintains accessible to "Indy" season pass holders
  try {
    const regionUrls = [
      "west-region",
      "rockies-region",
      "midwest-region",
      "east-region",
      "mid-atlantic-region",
    ];
    // complete axios get request for each link and save names of peaks in the array passesAndPeaks.indy = peaksIndy;
    const resortNames = [];
    const peaksIndy = [];
    for (const regionUrl of regionUrls) {
      const response = await axios.get(passUrls.indy + regionUrl);
      const $ = cheerio.load(response.data);
      $(".resort_list").each((i, element) => {
        const $h3 = $(element).find("h3");
        const $h4 = $(element).find("h4");
        $h4.each((i, e) => {
          const $e = $(e);
          const cityNState = $e.text();
          const cityNStateArry = cityNState.split(", ");
          const city = cityNStateArry[0];
          const state = cityNStateArry[1];
          const cityTxtFuzzy = decodeURIComponent(city);
          const stateTxt = decodeURIComponent(state);
          peaksIndy.push({ city: cityTxtFuzzy, state: stateTxt });
        });
      });
    }
    passesAndPeaks.indy = peaksIndy;
  } catch (err) {
    console.log(err.message);
  }
  // iterate over passesAndPeaks array and save in db
  for (const peak in passesAndPeaks) {
    //create new PassInfoModel for every pass key in {passesAndPeaks}
    const passInfo = new PassInfoModel({
      passName: peak,
    });
    passInfo.save((err, savedPass) => {
      //on successful save create a resortInfo model for each location in [pass]: array
      if (err) {
        next(err);
      }
      passesAndPeaks[peak].forEach((location) => {
        const resortInfo = new ResortInfoModel({
          city: location.city,
          state: location.state,
        });

        resortInfo.save((err, savedResortInfo) => {
          if (err) {
            next(err);
          } else {
            savedResortInfo.pass.push(savedPass._id);
            savedResortInfo.save();
            PassInfoModel.findById(
              savedResortInfo.pass[0],
              (err, successPassInfoModel) => {
                if (err) {
                  next(err);
                } else {
                  successPassInfoModel.resortAccessList.push(
                    savedResortInfo._id
                  );
                  successPassInfoModel.save();
                }
              }
            );
          }
        });
      });
    });
  }
  // send response for analysis
  res.json(passesAndPeaks);
};

exports.getResortCoordinates = async function (req, res, next) {
  ResortInfoModel.find({})
    // .limit(10)
    .exec((err, successResInfo) => {
      if (err) {
        console.log(err);
      } else {
        const test = [];
        successResInfo.forEach((resortInfo) => {
          resortInfo.getCoordinates();
        });
        res.send('test');
      }
    });
};

exports.getResortPlaceId = async function ( req, res, next) {
  ResortInfoModel.find({})
  .exec((err, successResInfo) => {
    if (err) {
      next(err);
    } else {
      let i = 0;
      const length = successResInfo.length;
      const getNextPlaceId = () => {
        if (i < length) {
          setTimeout(() => {
            successResInfo[i].getPlace_idNearby();
            i++;
            getNextPlaceId();
          }, 1000);
        } else {
          res.send('test');
        }
      };
      getNextPlaceId();
    }
  });
}

