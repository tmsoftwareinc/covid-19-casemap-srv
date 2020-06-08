module.exports = app => {
  const cases = require("../controllers/case.controller.js");

  // Retrieve all Cases
  app.get("/v1/cases", cases.findAll);

  // Retrieve a single Case with caseId
  app.get("/v1/cases/:caseId", cases.findOne);

  app.get("/v1/addresses/", cases.findAddressAll);

  app.get("/v1/latlngs/", cases.findLatlngAll);

};
