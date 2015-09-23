var PartyModel = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var PartyHandler = new Handler(PartyModel);
PartyHandler.update = null;
PartyHandler.remove = null;

var mongojs = require("mongojs");
var db = mongojs('electroscope', ['party_records']);

PartyHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.party.getAll(function (parties) {
      console.log("RECEIVED: " + parties.length + " records.");
    }).then(function (parties) {

      db.collection('party_records').drop(function (){
	console.log("DROPPED: Existing records.");
      });

      var party_records = [];
      for (var i = 0; i < parties.length; i++) {
      	var p = parties[i];
      	var party = {};

	party._id = p['id'];
      	party.code = getPartyCode (p['party_name_english']);
      	party.name = {
      	  en: p['party_name_english'],
      	  my: p['party_name']
      	};
      	party.seal = p['party_seal'];
      	party.flag = p['party_flag'];
	party_records.push(party);
      }

      db.collection('party_records').insert(party_records, function(err, doc) {
	if (err) { reject(err); }
	resolve(party_records);
      });

    }).catch(reject);
  });
};

var getPartyCode = (function () {
  var party_codes = [];

  return (function (english_name) {
    var code = english_name.toUpperCase()
	  .split(' ')
	  .map(function (x) {
	    if (typeof x == 'string' && x.length > 1) {
	      return x[0].match(/[A-Z]/) ? x[0] : '';
	    }
	    return null;
	  })
	  .join('');

    var sfx = 1;
    var party_code = code;
    while (party_codes.indexOf(party_code) != -1) {
      party_code = code + sfx;
    }

    party_codes.push(party_code);
    return party_code;
  });

})();

module.exports = PartyHandler;
