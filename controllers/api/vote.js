var Controller = $.rootRequire("controllers");

var VoteHandler = $.rootRequire("api/handlers/vote");
var VoteController = new Controller("vote", VoteHandler);

VoteController.router.get("/votes/count", function (req, res, next) {
  var query = req.query;
  VoteHandler.getCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

VoteController.router.get("/votes/count/by-party", function (req, res, next) {
  var query = req.query;
  VoteHandler.getByPartyCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

VoteController.router.get("/votes/count/by-parliament", function (req, res, next) {
  var query = req.query;
  VoteHandler.getByParliamentCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

VoteController.router.get("/votes/count/by-state", function (req, res, next) {
  var query = req.query;
  VoteHandler.getByStateCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

module.exports = VoteController.router;
