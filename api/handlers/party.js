var PartyModel = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var PartyHandler = new Handler(PartyModel);

PartyHandler.update = null;
PartyHandler.remove = null;

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

module.exports = PartyHandler;
