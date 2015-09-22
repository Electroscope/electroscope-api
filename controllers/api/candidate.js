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
  CandidateHandler.getByGenderCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

CandidateController.router.get("/candidates/count/by-party", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getByPartyCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

CandidateController.router.get("/candidates/count/by-ethnicity", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getByEthnicityCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

CandidateController.router.get("/candidates/count/by-religion", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getByReligionCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

CandidateController.router.get("/candidates/count/by-agegroup", function (req, res, next) {
  var query = req.query;
  CandidateHandler.getByAgegroupCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

module.exports = CandidateController.router;
