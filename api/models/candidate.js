var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CandidateSchema = new Schema({
  "id": String,
  "name": String,
  "gender": String,
  "legislature": String,
  "national_id": String,
  "birthdate": Date,
  "education": Schema.Types.Mixed,
  "occupation": [String],
  "nationality_religion": String,
  "residency": Schema.Types.Mixed,
  "constituency": Schema.Types.Mixed,
  "party_id": String,
  "mother": Schema.Types.Mixed,
  "father": Schema.Types.Mixed
});

var Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
