var Controller = $.rootRequire("controllers");
var PartyHandler = $.rootRequire("api/handlers/party");
var PartyController = new Controller("party", "api/handlers");

module.exports = PartyController.router;
