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

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
