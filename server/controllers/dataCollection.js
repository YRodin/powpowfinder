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
    mountainCollective: "https://mountaincollective.com/",
    indy: "https://www.indyskipass.com/resorts/", //indy requires traversing further down dom tree to grab data
  };
  const passesAndPeaks = {};
  //get list of mouintains accessible to "Epic" seaoason pass holders
  try {
    const peaksEpic = [];
    const response = await axios.get(passUrls.epic);
    const $ = cheerio.load(response.data);
    const ul = $("[aria-label='Full Access Epic Pass Resorts']").children("li");

    ul.each((index, element) => {
      const button = $(element).find("button");
      let peakName = button.html().replace(/<!-- -->/g, "");
      peakName = peakName.split(", ");
      peaksEpic.push({ city: peakName[0], state: peakName[1] });
    });
    passesAndPeaks.epic = peaksEpic;
  } catch (err) {
    console.log(err.message);
  }
  // get list of mouintains accessible to "Epic" seaoason pass holders
  try {
    const peaksIkon = [];
    const response = await axios.get(passUrls.ikon);
    const $ = cheerio.load(response.data);
    const ul = $("[aria-label='Full Access Ikon Pass Resorts']").children("li");

    ul.each((index, element) => {
      const button = $(element).find("button");
      let peakName = button.html().replace(/<!-- -->/g, "");
      peakName = peakName.split(", ");
      peaksIkon.push({ city: peakName[0], state: peakName[1] });
    });
    passesAndPeaks.ikon = peaksIkon;
  } catch (err) {
    console.log(err.message);
  }
  //get list of mouintains accessible to "MountainCollective" season pass holders
  try {
    const peaksMountainCollective = [];
    const response = await axios.get(passUrls.mountainCollective);
    const $ = cheerio.load(response.data);
    const ul = $(".resort-list").find("ul");
    $("#accordionunited-states .card").each((i, element) => {
      let peakName = $(element).find("span").text();
      peakName = peakName.replace(/\s*\|.*/, "");
      peakName = peakName.replace(/^\s*NEW!\s*/, "");
      peakName = peakName.split(", ");
      peaksMountainCollective.push({ city: peakName[0], state: peakName[1] });
    });
    passesAndPeaks.mountainCollective = peaksMountainCollective;
  } catch (err) {
    console.log(err.message);
  }
  //get list of mouintains accessible to "Indy" season pass holders
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
          let cityNState = $e.text();
          cityNState = cityNState.split(", ");
          peaksIndy.push({ city: cityNState[0], state: cityNState[1] });
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
        console.log(
          `passesAndPeaks[peak].forEach invoked with ${location.city} and ${location.state}`
        );
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
  //send response for analysis
  res.json(passesAndPeaks);
};

exports.getResortCoordinates = async function (req, res, next) {
  ResortInfoModel.find({})
    .limit(5)
    .exec((err, successResInfo) => {
      if (err) {
        next(err);
      } else {
        const test = [];
        successResInfo.forEach((resortInfo) => {
          resortInfo.getCoordinates();
        });
      }
    });
};
