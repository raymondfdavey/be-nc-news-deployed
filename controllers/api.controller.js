const endpoints = require("../project.json");

exports.getJSON = (req, res, next) => {
  res.status(200).send({ endpoints });
};
