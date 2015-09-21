#! /usr/bin/env node

var mongojs = require("mongojs");
var db = mongojs('localhost/electroscope');
db.dropDatabase();

console.log("Importing States ...");
var states = require('./states.json');
db.collection('states').insert(states);
db.collection('states').ensureIndex({"code": 1});

console.log("Importing Districts ...");
var districts = require('./districts.json');
db.collection('districts').insert(districts);
db.collection('districts').ensureIndex({"code": 1});

console.log("Importing Townships ...");
var townships = require('./townships.json');
db.collection('townships').insert(townships);
db.collection('townships').ensureIndex({"code": 1});

console.log("Importing Populations ...");
var population = require('./population.json');
db.collection('population').insert(population);
db.collection('population').ensureIndex({"code": 1});

console.log("Importing Parliaments ...");
var parliaments = require('./parliaments.json');
db.collection('parliaments').insert(parliaments);
db.collection('parliaments').ensureIndex({"code": 1});

console.log("Importing Parties ...");
var parties = require('./parties.json');
db.collection('parties').insert(parties);
db.collection('parties').ensureIndex({"location_code": 1});

console.log("Importing Candidate Records ...");
var candidate_records_2010 = require('./candidate_records_2010.json');
var candidate_records_2015 = require('./candidate_records_2015.json');
db.collection('candidate_records').insert(candidate_records_2010);
db.collection('candidate_records').insert(candidate_records_2015);

db.close();
