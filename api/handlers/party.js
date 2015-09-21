var PartyModel = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var PartyHandler = new Handler(PartyModel);

PartyHandler.update = null;
PartyHandler.remove = null;

var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records', 'parties']);

PartyHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.party.getAll(function (parties) {
      console.log(parties.length + " parties are got!!");
    }).then(function (parties) {
      parties = parties.map(function(party){
        party.party_id = party.id;
        return party;
      })
      console.log("Sample party", parties[0]);
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
  var $match = {year: 2015};

  if (query.year) { $match.year = parseInt(query.year); }

  return new Promise(function (resolve, reject) {
    db.candidate_records.aggregate([
      {$match: $match},
      {
        $group: {
          _id: {
            party: "$party",
            parliament_code: "$parliament_code"
          },
          count: {$sum: 1}
        }
      },
      {
        $group: {
          _id: "$_id.party",
          counts: {
            $addToSet: {
              parliament_code: "$_id.parliament_code",
              count: "$count"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          party: "$_id",
          counts: 1
        }
      }
    ], function(err, result) {
        if (err) { reject(err); }
        return resolve(result);
    });
  });
};

module.exports = PartyHandler;
