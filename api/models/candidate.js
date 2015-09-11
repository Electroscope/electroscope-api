var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CandidateSchema = new Schema({
}, {strict: false});

CandidateSchema.set('toObject', { getters: true });

var Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
