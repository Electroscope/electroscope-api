var host = process.env.MONGOLAB_URI || "localhost/electroscope";
var mongoose = require("mongoose");
var db = mongoose.connect(host);
