var PartyModel = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var PartyHandler = new Handler(PartyModel);
var CandidateHandler = $.rootRequire('api/handlers/candidate.js');

PartyHandler.update = null;
PartyHandler.remove = null;

var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records', 'party_records']);

PartyHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.party.getAll(function (parties) {
      console.log(parties.length + " parties are got!!");
    }).then(function (parties) {
      parties = parties.map(function(party){
        party.party_id = party.id;
        return party;
      });

      handler.create({
        data: parties
      }).then(function () {
        console.log(parties.length
            + " parties had been saved");
        resolve(parties);
      }).catch(reject);

    }).catch(reject);
  });
};

PartyHandler.getCandidateCounts = function(query){
  /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  query.group_by = 'party,parliament_code'; // 'party'
  query.$extra_pipeline = [
    { $group: {
      _id: '$party',
      parliament_counts: {$addToSet: {count: "$count", parliament: '$parliament'}},
      total_count: {$sum: '$count'}
    }},
    { $project: {
      party: '$_id',
      _id: 0,
      parliament_counts: 1,
      total_count: 1
    }}
  ];

  return CandidateHandler.getCount(query);
};

PartyHandler.getGenderCountsByParty = function(party, query){
  /* Support only 2015 right now */
  query.year = 2015;
  query.group_by = 'party,candidate.gender';
  query.party = party;

  query.$extra_pipeline = [
    { $match: {gender: {$in : [ 'M', 'F']}} } ,
    { $group: {
      _id: '$party',
      gender_counts: {$addToSet: {count: "$count", gender: '$gender'}},
      total_count: {$sum: '$count'}
    }},
    { $project: {
      party: '$_id',
      _id: 0,
      gender_counts: 1,
      total_count: 1
    }}
  ];

  return CandidateHandler.getCount(query);
};

PartyHandler.getCandidateCountsByParty = function(party, query){
  /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  query.group_by = 'parliament_code';
  query.party = party;

  return CandidateHandler.getCount(query);
};

module.exports = PartyHandler;
