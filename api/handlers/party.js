var Party = $.rootRequire("api/models/party");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var PartyHandler = new Handler(Party);

PartyHandler.syncWithMaePaySoh = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.party.getList()
      .then(function (parties) {
        self.create(parties)
          .then(function (savedPartites) {
            resolve(savePartites);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

module.exports = PartyHandler;
