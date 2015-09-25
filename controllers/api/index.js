var express = require("express");
var apiControl = express.Router();

// Controllers Register here
var candidate = require("./candidate");
apiControl.use(candidate);

var party = require("./party");
apiControl.use(party);

var vote = require("./vote");
apiControl.use(vote);

var winner = require("./winner");
apiControl.use(winner);

module.exports = apiControl;
