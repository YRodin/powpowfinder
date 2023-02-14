const authentication = require("./authentication");
const WeatherNPassInfo = require("../models/weatherNPassInfo");
const axios = require("axios");
const cheerio = require("cheerio");
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
      const formattedResortName = button.html().replace(/<!-- -->/g, "");
      // html().replace('<!-- -->', '');
      peaksEpic.push(formattedResortName);
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
      const formattedResortName = button.html().replace(/<!-- -->/g, "");
      // html().replace('<!-- -->', '');
      peaksIkon.push(formattedResortName);
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
      peaksMountainCollective.push(peakName);
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
    const resortLocations = [];
    for (const regionUrl of regionUrls) {
      const response = await axios.get(passUrls.indy + regionUrl);
      const $ = cheerio.load(response.data);
      $(".resort_list").each((i, element) => {
        const $h3 = $(element).find("h3");
        const $h4 = $(element).find("h4");
        $h3.each((i, e) => {
          const $e = $(e);
          resortNames.push($e.text().replace(/\s+$/, ""));
        });
        $h4.each((i, e) => {
          const $e = $(e);
          resortLocations.push($e.text());
        });
      });
    }
    //combine resort names with corresponding locations
    const peaksIndy = resortNames.map(
      (value, index) => value + ", " + resortLocations[index]
    );
    passesAndPeaks.indy = peaksIndy;
  } catch (err) {
    console.log(err.message);
  }
  res.json(passesAndPeaks);
};

// TODO:
// get mountainList for each pass
// save all mountain lists as obj props with data as array of strings
