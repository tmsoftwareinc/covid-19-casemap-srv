const Geo = require("../models/geo.model.js");

exports.findLatlng = (req, res) => {
  Geo.getLatlng(req.query.location, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving refs."
      });
    else res.send(data);
  });  
};

