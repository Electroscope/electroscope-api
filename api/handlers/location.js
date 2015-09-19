var LocationModel = $.rootRequire("api/models/location");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var LocationHandler = new Handler(LocationModel);

LocationHandler.update = null;
LocationHandler.remove = null;

LocationHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.location.getAll(function (locations) {
      console.log(locations.length + " locations are got!")
    }).then(function (locations) {

      handler.create({
        data: locations
      })
      .then(function () {
        console.log(locations.length 
            + " locations had been saved");
        resolve(locations);
      }).catch(reject);

    }).catch(reject);
  });
};

module.exports = LocationHandler;
