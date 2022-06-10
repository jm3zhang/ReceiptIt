"use strict";
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const appRoot = require('app-root-path');
const morgan = require('morgan');
const winston = require(appRoot + '/lib/plugins/Logger');

const port = process.env.PORT || 8080;
const app = express();
const api = require(appRoot + '/lib/api/components/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

/** Register API endpoints */
api._register(app);

app.listen(port, () => {
    winston.info(`ReceiptIt api service running on port ${port}`);
});

module.exports = app;
