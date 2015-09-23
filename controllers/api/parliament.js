esvar Controller = $.rootRequire("controllers");
var ParliamentHandler = $.rootRequire("api/handlers/candidate");
var ParliamentController = new Controller("candidate", ParliamentHandler);

module.exports = ParliamentController.router;
