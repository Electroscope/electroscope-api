var CandidateModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var CandidateHandler = new Handler(CandidateModel);

CandidateHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.candidate.getAll(function (candidates) {
      console.log(candidates.length + " candidates are got!!")
    }).then(function (candidates) {

      handler.create({
        data: candidates
      })
      .then(function () {
        console.log(candidates.length 
            + " candidates had been saved");
      }).catch(reject);

      resolve(candidates);
    }).catch(reject);
  });
};

module.exports = CandidateHandler;
