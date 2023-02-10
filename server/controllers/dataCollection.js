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
    indy: "https://www.indyskipass.com/indy-pass-resort-map/", //indy requires traversing further down dom tree to grab data
  };

  const passesAndPeaks = {};
  // get list of mouintains accessible to "Epic" seaoason pass holders
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
    
    ul.each((index, element) => {
      const liHtml = $(element).text();
      const formattedLiHtml = liHtml
        .replace(/\n|\t|\*|NEW!|SkiBig3/g, "") 
        .replace(/—|-\s|/g, "");
     
      peaksMountainCollective.push(formattedLiHtml);
    });

    passesAndPeaks.mountainCollective = peaksMountainCollective;

    console.log(`this is peaksMC ${passesAndPeaks.mountainCollective}`);
  } catch (err) {
    console.log(err.message);
  }
  res.json(passesAndPeaks);
};

// TODO:
// get mountainList for each pass
// save all mountain lists as obj props with data as array of strings
