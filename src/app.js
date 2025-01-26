const express = require("express");
const bodyParser = require("body-parser");
const { errorHandler } = require("./utils/errorHandler");
const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
