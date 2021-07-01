const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route");
const {
  send405Error,
  handlePSQLErrors,
  handleServerErrors,
  handleCustomErrors
} = require("./errorHandling/error.functions");
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/api", apiRouter).all(send405Error);

app.use("/", apiRouter).all(send405Error);
app.get("/", (req, res, next) => {
    console.log("getting to base of server");
    res.status(200).send({ message: "Seems to be working" });
  });
app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
