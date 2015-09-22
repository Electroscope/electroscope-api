var ParliamentModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");

var ParliamentHandler = new Handler(ParliamentModel);
var CandidateHandler = $.rootRequire('api/handlers/candidate.js');

var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records', 'party_records']);

module.exports = ParliamentHandler;
