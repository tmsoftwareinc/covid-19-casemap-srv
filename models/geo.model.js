// const sql = require("./db.js");
var geocoder = require('geocoder');

// constructor
const Geo = function(thiscase) {
  this.lat = thiscase.lat;
  this.long = thiscase.long;
};

const http = require('http');


Geo.getLatlng = (location, result) => {
  geocoder.geocode(location, function ( err, data ) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    else {
      result(null, data["results"][0]["geometry"]["location"]);
    }
  }, { key: process.env.KEY });
};

module.exports = Geo;

