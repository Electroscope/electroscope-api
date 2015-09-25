var Controller = $.rootRequire("controllers");
var PartyHandler = $.rootRequire("api/handlers/party");
var PartyController = new Controller("party", "api/handlers");

PartyController.router.get("/parties", function (req, res, next) {
  var query = req.query;
  PartyHandler.getParties(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

module.exports = PartyController.router;
