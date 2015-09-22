esvar Controller = $.rootRequire("controllers");

var ParliamentHandler = $.rootRequire("api/handlers/candidate");
var ParliamentController = new Controller("candidate", ParliamentHandler);

ParliamentController.router.get("/candidate-count", function (req, res, next) {
  var query = req.query;
  ParliamentHandler.getCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

ParliamentController.router.get("/candidate-locations", function (req, res, next) {
  var query = req.query;
  ParliamentHandler.getLocations({
    query: query
  }).then(function (result) {
    res.send({data: result});
  }).catch(function (err) {
    next(err);
  });
});

ParliamentController.router.get("/candidates/count-by-party", function (req, res, next) {
  var query = req.query;
  console.log("query ", query);
  ParliamentHandler.partyParliamentCountByStates(query).then(function (result) {
    res.send({data: result});
  }).catch(function (err) {
    next(err);
  });
});

ParliamentController.router.get("/legislatures/:legislature/candidates/count-per-constituency", function (req, res, next) {
  var query = {legislature: req.params.legislature };
  ParliamentHandler.getParliamentCountPerConstituency(query).then(function (result) {
    res.send({data: result});
  }).catch(function (err) {
    next(err);
  });
});

module.exports = ParliamentController.router;
