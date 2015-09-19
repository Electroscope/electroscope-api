var Controller = $.rootRequire("controllers");

var CandidateHandler = $.rootRequire("api/handlers/candidate");
var CandidateController = new Controller("candidate", CandidateHandler);

CandidateController.router.get("/candidate-groupby", function (req, res, next) {
  var query = req.query;
  CandidateHandler.groupbyLegislatureStateDistrict(query)
    .then(function (result) {
      res.send(result);
    }).catch(function (err) {
      next(err);
    });
});

CandidateController.router.get("/candidate-locations", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getLocations({
    query: query
  }).then(function (result) {
    res.send(result);
  }).catch(function (err) {
    next(err);
  });
});

CandidateController.router.get("/candidates/count-by-party", function (req, res, next) {
  var query = req.query;
  console.log("query ", query);
  CandidateHandler.partyCandidateCountByStates(query).then(function (result) {
    res.send(result);
  }).catch(function (err) {
    next(err);
  });
});

CandidateController.router.get("/legislatures/:legislature/candidates/count-per-constituency", function (req, res, next) {
  var query = {legislature: req.params.legislature };
  CandidateHandler.getCandidateCountPerConstituency(query).then(function (result) {
    res.send(result);
  }).catch(function (err) {
    next(err);
  });
});

module.exports = CandidateController.router;
