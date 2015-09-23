global.$ = require("../../global");
var db = $.rootRequire("config/database");
var CandidateHandler = require("../handlers/candidate");
var PartyHandler = require("../handlers/party");
var LocationHandler = require("../handlers/location");

var tasks = [partySyncTask, candidateSyncTask]; //, locationSyncTask];

var ro = "\\ | / -".split(" ");
var time = 0;
setInterval(function () {
  if (time > 3) {
    time = 0;
  }

  process.stdout.write(ro[time] + "\r");
  time++;
}, 100);

function candidateSyncTask(callback) {
  console.log("STARTED: Candidate Sync");
  return CandidateHandler.syncWithMaePaySoh()
    .then(function (candidates) {
      console.log("IMPORTED: " + candidates.length + " records.");
      console.log("DONE: Candiate Sync");
      callback();
    }).catch(function (err) {
      console.log(err);
      callback(err);
    });
}

function partySyncTask(callback) {
  // Start Sync with maepaysoh
  console.log("STARTED: Parties Sync");
  return PartyHandler.syncWithMaePaySoh()
    .then(function (parties) {
      console.log("IMPORTED: " + parties.length + " records.");
      console.log("DONE: Party Sync");
      callback();
    }).catch(function (err) {
      console.log(err);
      callback(err);
    });
}

function locationSyncTask(callback) {
  // Start Sync with maepaysoh
  LocationHandler.model.remove()
    .then(function () {
      console.log("CLEANED: Locations");
      console.log("STARTED: Location Sync");
      return LocationHandler.syncWithMaePaySoh()
        .then(function (locations) {
	  console.log("IMPORTED: " + locations.length + " records");
	  console.log("DONE: Location Sync");
          callback();
        }).catch(function (err) {
          console.log(err);
          callback(err);
        });
    });
}

var args = process.argv;
if (args.indexOf("-c") !== -1) {
  tasks = [];
  if (args.indexOf("candidate") !== -1) {
    tasks.push(candidateSyncTask);
  }
  if (args.indexOf("party") !== -1) {
    tasks.push(partySyncTask);
  }
  if (args.indexOf("location") !== -1) {
    tasks.push(locationSyncTask);
  }
}

var async = require('async');
/* Need to be done one by one */
var queue = async.queue (function (task, callback) {
  task(callback);
}, 1);

queue.drain = process.exit;
queue.push(tasks);
