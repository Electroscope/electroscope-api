#! /usr/bin/env node

var mongojs = require("mongojs");
var db = mongojs('localhost/electroscope');
var emitter = new (require('events').EventEmitter);

var count = 0;

emitter.on("import_done", function(data){
  console.log("Imported count", data);
  if(data === 7){
    console.log("Closing connection now");
    db.close();
    process.exit(0);
  }
})

db.collection('states').drop(function(){
  count += 1;
  console.log("Importing States ...");
  var states = require('./states.json');
  db.collection('states').insert(states);
  db.collection('states').ensureIndex({"code": 1});
  emitter.emit('import_done', count);
});
db.collection('districts').drop(function(){
  count += 1;
  console.log("Importing Districts ...");
  var districts = require('./districts.json');
  db.collection('districts').insert(districts);
  db.collection('districts').ensureIndex({"code": 1});
  emitter.emit('import_done', count);

});
db.collection('townships').drop(function(){
  count += 1;
  console.log("Importing Townships ...");
  var townships = require('./townships.json');
  db.collection('townships').insert(townships);
  db.collection('townships').ensureIndex({"code": 1});
  emitter.emit('import_done', count);
});
db.collection('population').drop(function(){
  count += 1;
  console.log("Importing Populations ...");
  var population = require('./population.json');
  db.collection('population').insert(population);
  db.collection('population').ensureIndex({"code": 1});
  emitter.emit('import_done', count);
});
db.collection('parliaments').drop(function(){
  count += 1;
  console.log("Importing Parliaments ...");
  var parliaments = require('./parliaments.json');
  db.collection('parliaments').insert(parliaments);
  db.collection('parliaments').ensureIndex({"code": 1});
  emitter.emit('import_done', count);
});
db.collection('party_records').drop(function(){
  count += 1;
  console.log("Importing Parties ...");
  var parties = require('./parties.json');
  db.collection('party_records').insert(parties);
  db.collection('party_records').ensureIndex({"location_code": 1});
  emitter.emit('import_done', count);
});
db.collection('candidate_records').drop(function(){
  count += 1;
  console.log("Importing Candidate Records ...");
  var c2010 = require('./candidate_records_2010.json');
  var c2015 = require('./candidate_records_2015.json');
  db.collection('candidate_records').insert(c2010);
  emitter.emit('import_done', count);
  db.collection('candidate_records').insert(c2015);
});
