var express = require("express");
var apiControl = express.Router();

// Controllers Register here
var candidate = require("./candidate");
apiControl.use(candidate);

var party = require("./party");
apiControl.use(party);

module.exports = apiControl;
