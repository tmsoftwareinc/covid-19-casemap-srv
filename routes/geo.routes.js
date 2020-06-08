module.exports = app => {
  const geos = require("../controllers/geo.controller.js");

  // Retrieve recent reference
  app.get("/v1/geos", geos.findLatlng);

};
