var Controller = $.rootRequire("controllers");
var PartyHandler = $.rootRequire("api/handlers/party");
var PartyController = new Controller("party", "api/handlers");

PartyController.router.get("/parties/candidate-count", function (req, res, next) {
  var query = req.query;
  PartyHandler.getCandidateCounts(query).then(function (result) {
    res.send({data: result});
  }).catch(function (err) {
    next(err);
  });
});

PartyController.router.get("/parties/:party/candidate-count", function (req, res, next) {
  var query = req.query;
  var party = req.params.party;
  PartyHandler.getCandidateCountsByParty(party, query).then(function (result) {
    res.send({data: result});
  }).catch(function (err) {
    next(err);
  });
});

module.exports = PartyController.router;
