var Controller = $.rootRequire("controllers");

var WinnerHandler = $.rootRequire("api/handlers/winner");
var WinnerController = new Controller("winner", WinnerHandler);

WinnerController.router.get("/winners/count", function (req, res, next) {
  var query = req.query;
  WinnerHandler.getWinnerCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

WinnerController.router.get("/winners/count/by-party", function (req, res, next) {
  var query = req.query;
  WinnerHandler.getWinnerCountByParty(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

WinnerController.router.get("/winners/count/by-parliament", function (req, res, next) {
  var query = req.query;
  WinnerHandler.getWinnerCountByParliament(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

WinnerController.router.get("/winners/count/by-state", function (req, res, next) {
  var query = req.query;
  WinnerHandler.getWinnerCountByState(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

module.exports = WinnerController.router;
