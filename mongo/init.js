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
  if(data === 8){
    console.log("Closing connection now");
    db.close();
    process.exit(0);
  }
})

db.collection('states').drop(function(){
  console.log("Importing States ...");
  var states = require('./states.json');
  db.collection('states').insert(states, function(err, data){
  count += 1;
    if(err){
      throw err;
    }
    console.log("Now count ", count);
    db.collection('states').ensureIndex({"code": 1});
    emitter.emit('import_done', count);
  });
});

db.collection("districts").drop(function(){
  console.log("Importing Districts ...");
  var districts = require("./districts.json");
  db.collection("districts").insert(districts, function(err, data){
  count += 1;
    if(err){
      throw err;
    }
    console.log("Now count ", count);
    db.collection("districts").ensureIndex({"code": 1});
    emitter.emit("import_done", count);
  });
});

db.collection("townships").drop(function(){
  console.log("Importing Townships ...");
  var townships = require('./townships.json');
  db.collection('townships').insert(townships, function(err, data){
  count += 1;
    if(err){
      throw err;
    }
    console.log("Now count ", count);
    db.collection('townships').ensureIndex({"code": 1});
    emitter.emit('import_done', count);
  });
});

db.collection('population').drop(function(){
  console.log("Importing Populations ...");
  var population = require('./population.json');
  db.collection('population').insert(population, function(err, data){
  count += 1;
    if(err){
      throw err;
    }
    console.log("Now count ", count);
    db.collection('population').ensureIndex({"code": 1});
    emitter.emit('import_done', count);
  });
});

db.collection('parliaments').drop(function(){
  console.log("Importing Parliaments ...");
  var parliaments = require('./parliaments.json');
  db.collection('parliaments').insert(parliaments, function(err, data){
  count += 1;
    if(err){
      throw err;
    }
    console.log("Now count ", count);
    db.collection('parliaments').ensureIndex({"code": 1});
    emitter.emit('import_done', count);
  });
});

db.collection('party_records').drop(function(){
  console.log("Importing Parties ...");
  var parties = require('./parties.json');
  db.collection('party_records').insert(parties, function(err, data){
  count += 1;
    if(err){
      throw err;
    }
    console.log("party_records count", count);
    db.collection('party_records').ensureIndex({"location_code": 1});
    emitter.emit('import_done', count);
  });
});

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

console.log("Importing Candidate Records 2015...");
var c2015 = require('./candidate_records_2015.json');
var collection2 = db.collection('candidates');
var track2 = c2015.length;
db.batchInsert(collection, c2015, function(err, data){
  if(err){
    throw err;
  }
  track2 -= 1;
  console.log("\rCandidate Record Left", track);
  if(track2 <= 0){
    console.log("All candidates inserted now");
    count += 1;
    emitter.emit('import_done', count);
  }
});
