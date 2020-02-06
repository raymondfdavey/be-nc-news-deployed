const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route");
const send405Error = require("./errorHandling/error.functions");
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  // console.log("in error block, error:", err);
  if (err.status !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code !== undefined) {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "BAD REQUEST" });
    }
    if (err.code === "23503") {
      res.status(404).send({ msg: "RESOURCE NOT FOUND" });
    }
    if (err.code === "42703") {
      res.status(400).send({ msg: "CANNOT PROCESS" });
    }
  }
});

module.exports = app;
