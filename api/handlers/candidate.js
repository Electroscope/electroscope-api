var Candidate = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");

var CandidateHandler = new Handler(Candidate);

CandidateHandler.syncWithMaePaySoh = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.candidate.getList()
      .then(function (candidates) {
        self.create(candidates)
          .then(function (savedCandidates) {
            resolve(saveCandidates);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};


module.exports = CandidateHandler;
