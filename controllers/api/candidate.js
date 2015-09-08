var Controller = $.rootRequire("controllers");
var CandidateController = new Controller("candidate", "api/handlers");

module.exports = CandidateController.router;
