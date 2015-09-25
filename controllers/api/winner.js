var Controller = $.rootRequire("controllers");

var WinnerHandler = $.rootRequire("api/handlers/winner");
var WinnerController = new Controller("winner", WinnerHandler);

WinnerController.router.get("/winners/count", function (req, res, next) {
  var query = req.query;
  WinnerHandler.getCount(query)
    .then(function (result) {
      res.send({data: result});
    }).catch(function (err) {
      next(err);
    });
});

// WinnerController.router.get("/winners/count/by-party", function (req, res, next) {
//   var query = req.query;
//   WinnerHandler.getByPartyCount(query)
//     .then(function (result) {
//       res.send({data: result});
//     }).catch(function (err) {
//       next(err);
//     });
// });

// WinnerController.router.get("/winners/count/by-parliament", function (req, res, next) {
//   var query = req.query;
//   WinnerHandler.getByParliamentCount(query)
//     .then(function (result) {
//       res.send({data: result});
//     }).catch(function (err) {
//       next(err);
//     });
// });

// WinnerController.router.get("/winners/count/by-state", function (req, res, next) {
//   var query = req.query;
//   WinnerHandler.getByStateCount(query)
//     .then(function (result) {
//       res.send({data: result});
//     }).catch(function (err) {
//       next(err);
//     });
// });

module.exports = WinnerController.router;
