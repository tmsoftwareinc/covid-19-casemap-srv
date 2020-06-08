const Case = require("../models/case.model.js");

// Retrieve all Casess from the database.
exports.findAll = (req, res) => {
  Case.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    else res.send(data);
  });  
};

// Find a single Case with a caseId
exports.findOne = (req, res) => {
  Case.findById(req.params.caseId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Case with id ${req.params.caseId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Case with id " + req.params.caseId
        });
      }
    } else res.send(data);
  });  
};

exports.findAddressAll = (req, res) => {
  Case.getAddressAll(req.query.country,req.query.state,req.query.county,req.query.city, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    else res.send(data);
  });  
};

exports.findLatlngAll = (req, res) => {
  Case.getLatlngAll(req.query.lat,req.query.long, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    else res.send(data);
  });  
};
