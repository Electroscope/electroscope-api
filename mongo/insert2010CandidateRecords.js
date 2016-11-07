#! /usr/bin/env node

var mongojs = require("mongojs");
var db = mongojs('localhost/electroscope');
var emitter = new (require('events').EventEmitter);

var count = 0;

db.batchInsert = function(collection, docs, options, callback) {
  var errors = [], results = [];
  var total = docs.length, n = 0;
  docs.forEach(function(doc, index, array) {
    collection.insert(doc, options, function(err, result) {
      if(err) {
        err.doc = doc;//save doc to err obj
        errors.push(err);// get each error
      } else {
        results.push(result);// get each success result
      }
      if(++n == total) {
        if(errors.length == 0) errors = null;
        callback(errors, results);
      }
    });
  });
};

emitter.on("import_done", function(data){
  console.log("Imported count", data);
  if(data === 1){
    console.log("Closing connection now");
    db.close();
    process.exit(0);
  }
})


console.log("Importing Candidate Records ...");
var c2010 = require('./candidate_records_2010.json');
var collection = db.collection('candidate_records');
var track = c2010.length;
db.batchInsert(collection, c2010, function(err, data){
  if(err){
    throw err;
  }
  track -= 1;
  console.log("\rCandidate Record Left", track);
  if(track <= 0){
    console.log("All candidates inserted now");
    count += 1;
    emitter.emit('import_done', count);
  }
});