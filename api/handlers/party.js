var PartyModel = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var PartyHandler = new Handler(PartyModel);

PartyHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.party.getAll()
      .then(function (parties) {
        handler.create({
          data: parties
        }).then(function (data) {
          parties = data.data;
          console.log(parties.length
              + " parties had been saved");
          resolve(parties);
        }).catch(reject);
      })
      .catch(reject);
  });
};

module.exports = PartyHandler;
