var Controller = $.rootRequire("controllers");

var CandidateHandler = $.rootRequire("api/handlers/candidate");
var CandidateController = new Controller("candidate", CandidateHandler);

CandidateController.router.get("/candidates/count", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

CandidateController.router.get("/candidates/count/by-gender", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getGenderCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

CandidateController.router.get("/candidates/count/by-party", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getPartyCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

module.exports = CandidateController.router;
