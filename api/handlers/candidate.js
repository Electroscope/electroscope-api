var Candidate = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var CandidateHandler = new Handler(Candidate);

CandidateHandler.syncWithMaePaySoh = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.candidate.getAll(function (candidates) {
      self.create({
        data: candidates
      })
      .then(function () {
        console.log(candidates.length 
            + " candidates had been saved");
      })
      .catch(reject);
    }).then(function (candidates) {
      resolve(candidates);
    }).catch(reject);
  });
};

module.exports = CandidateHandler;
