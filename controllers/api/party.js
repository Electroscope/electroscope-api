var Controller = $.rootRequire("controllers");
var PartyHandler = $.rootRequire("api/handlers/party");
var PartyController = new Controller("party", "api/handlers");

PartyController.router.get("/party/candidate-count", function (req, res, next) {
  var query = {legislature: req.params.legislature };
  PartyHandler.getCandidateCounts(query).then(function (result) {
    res.send({data: result});
  }).catch(function (err) {
    next(err);
  });
});

module.exports = PartyController.router;
