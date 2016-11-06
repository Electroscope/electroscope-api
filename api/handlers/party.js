var PartyModel = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");
var RawParites = $.rootRequire('parties_raw.json');

var PartyHandler = new Handler(PartyModel);
PartyHandler.update = null;
PartyHandler.remove = null;

var mongojs = require("mongojs");
var db = mongojs('electroscope', ['party_records']);

PartyHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.candidate.getAll(function (parties) {
      console.log("hello", parties);
      console.log("RECEIVED: " + parties.length + " records.");
    }, {per_page: 100}).then(function (parties) {
      parties = RawParites;
      db.collection('party_records').drop(function (){
	console.log("DROPPED: Existing records.");
      });

      var party_records = [];
      for (var i = 0; i < parties.length; i++) {
      	var p = parties[i];
      	var party = {};

	party._id = p['id'];
	var party_name_english = p['party_name_english'];

	if (p['party_name_english'] == "0" ) {
	  party_name_english = "Chin League of Democracy";
	}
	if (p['party_name_english'] == "" ) {
	  party_name_english = "Inn TainnYinThar Party";
	}

      	party.code = getPartyCode (party_name_english);
      	party.name = {
      	  en: party_name_english,
      	  my: p['party_name']
      	};
      	party.seal = p['party_seal'];
      	party.flag = p['party_flag'];
	party_records.push(party);
      }

      var party_names_2010 = [
	"Independent Candidates",
	"Wunthanu NLD (The Union Of Myanmar)",
	"Peace and Diversity Party",
	"Chin National Party",
	"Rakhine Nationals Development Party",
	"Rakhine State National Force Of Myanmar",
	"Mro Or Khami National Solidarity Organization",
	"Kaman National Progressive Party",
	"United Democratic Party - Kachin State"
      ];

      for(var i = 0; i < party_names_2010.length; i++) {
	party = party_names_2010[i];
	party_records.push({
	  _id: party_records.length + i + 1,
	  code: getPartyCode(party),
	  name: {
	    en: party
	  }
	});
      }

      db.collection('party_records').insert(party_records, function(err, doc) {
	if (err) { reject(err); }
	resolve(party_records);
      });

    }).catch(reject);
  });
};


var allParties = {};

PartyHandler.getParties = function () {
  var allParties = {};

  return new Promise(function (resolve, reject) {
    db.collection('party_records').find().forEach(function (err, doc) {
      if(err) { reject(err); }
      if (!doc) {
	resolve(allParties);
      } else {
	allParties[doc.code] = doc.name.en;
      }
    });
  });
};

var getPartyCode = (function () {
  var party_codes = [];

  return (function (english_name) {
    console.log("english name", english_name);
    if(!english_name) { console.log(party) return null; }
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

    if (party_code == "NLFD") party_code = "NLD";
    if (party_code == "USADP") party_code = "USDP";
    party_codes.push(party_code);
    return party_code;
  });

})();

module.exports = PartyHandler;
