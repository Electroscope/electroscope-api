var Controller = $.rootRequire("controllers");
var PartyController = new Controller("party", "api/handlers");

module.exports = PartyController.router;
