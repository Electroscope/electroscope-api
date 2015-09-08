var express = require("express");
var apiControl = express.Router();

// Controllers Register here
var candidate = require("./candidate");
apiControl.use(candidate)

module.exports = apiControl;
