var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CandidateSchema = new Schema({
  dataCollectionYear: {type: String}
});

var Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
