var PartyModel = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var PartyHandler = new Handler(PartyModel);

PartyHandler.syncWithMaePaySoh = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.party.getList()
      .then(function (data) {
        self.create({
          data: data.parties
        }).then(function (parties) {
          resolve(parties);
        }).catch(reject);
      })
      .catch(reject);
  });
};

module.exports = PartyHandler;
