global.$ = require("../../global");
var db = $.rootRequire("config/database");
var CandidateHandler = require("../handlers/candidate");
var PartyHandler = require("../handlers/party");
var LocationHandler = require("../handlers/location");

var args = process.argv;
var tasks = [candidateSyncTask, partySyncTask, locationSyncTask];

var doneTasks = 0;
function exit() {
  doneTasks++;
  if (doneTasks === tasks.length) {
    process.exit();
  }
}

var ro = "\\ | / -".split(" ");
var time = 0;
setInterval(function () {
  if (time > 3) {
    time = 0;
  }
  
  process.stdout.write(ro[time] + "\r");
  time++;
}, 100);

function candidateSyncTask() {
  // Start Sync with maepaysoh
  CandidateHandler.model.remove()
    .then(function () {
      console.log("Candidate collection have been clean");
      console.log("Candidate collection start syncing");
      return CandidateHandler.syncWithMaePaySoh()
        .then(function (candidates) {
          console.log("Candiate sync DONE: total of " 
              + candidates.length
              + " candidates have been saved");
          exit();
        }).catch(function (err) {
          console.log(err);
          exit();
        });
    });
}

function partySyncTask() {
  // Start Sync with maepaysoh
  PartyHandler.model.remove()
    .then(function () {
      console.log("Party collection have been clean");
      console.log("Party collection start syncing");
      return PartyHandler.syncWithMaePaySoh()
        .then(function (parties) {
          console.log("Parties sync DONE: total of " 
              + parties.length
              + " parties have been saved");
          exit();
        }).catch(function (err) {
          console.log(err);
          exit();
        });
    });
}

function locationSyncTask() {
  // Start Sync with maepaysoh
  LocationHandler.model.remove()
    .then(function () {
      console.log("Location collection have been clean");
      console.log("Location collection start syncing");
      return LocationHandler.syncWithMaePaySoh()
        .then(function (locations) {
          console.log("Location sync DONE: total of " 
              + locations.length
              + " locations have been saved");
          exit();
        }).catch(function (err) {
          console.log(err);
          exit();
        });
    });
}


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
tasks.forEach( task => task() );
