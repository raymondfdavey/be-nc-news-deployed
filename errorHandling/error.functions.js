exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "BAD REQUEST" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "RESOURCE NOT FOUND" });
  }
  if (err.code === "42703") {
    res.status(400).send({ msg: "CANNOT PROCESS" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
