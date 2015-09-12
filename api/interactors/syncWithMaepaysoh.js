global.$ = require("../../global");
var db = $.rootRequire("config/database");
var CandidateHandler = require("../handlers/candidate");
var PartyHandler = require("../handlers/party");

// Start Sync with maepaysoh
CandidateHandler.model.remove(function (err) {
  if (err) {
    return console.error(err);
  }
  console.log("Candidate collection have been clean");
  console.log("Candidate collection start syncing");
  CandidateHandler.syncWithMaePaySoh()
    .then(function (candidates) {
      console.log("DONE: total of " + candidates.length
          + " candidates have been saved");
    }).catch(function (err) {
      console.log(err);
    });
});

// Start Sync with maepaysoh
PartyHandler.model.remove(function (err) {
  if (err) {
    return console.error(err);
  }
  console.log("Party collection have been clean");
  console.log("Party collection start syncing");
  PartyHandler.syncWithMaePaySoh()
    .then(function (parties) {
      console.log("DONE: total of " + parties.length
          +  " parties have been saved");
    }).catch(function (err) {
      console.log(err);
    });
});
