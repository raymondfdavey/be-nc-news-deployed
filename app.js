const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {});

module.exports = app;
