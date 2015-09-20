#! /usr/bin/env mongo

con = new Mongo();
db  = con.getDB('electroscope');

load('states.js');
db.states.drop();
db.states.insert(states);
db.states.ensureIndex({"code": 1});

load('districts.js');
db.districts.drop();
db.districts.insert(districts);
db.states.ensureIndex({"code": 1});

load('townships.js');
db.townships.drop();
db.townships.insert(townships);
db.states.ensureIndex({"code": 1});

load('population.js');
db.population.drop();
db.population.insert(population);
db.states.ensureIndex({"code": 1});

load('parliaments.js');
db.parliaments.drop();
db.parliaments.insert(parliaments);
db.states.ensureIndex({"code": 1});

load('parties.js');
db.parties.drop();
db.parties.insert(parties);
db.states.ensureIndex({"location_code": 1});

load('candidate_records_2010.js');
load('candidate_records_2015.js');
db.candidate_records.drop();
db.candidate_records.insert(c2010);
db.candidate_records.insert(c2015);
