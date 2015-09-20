// Controller is just handle of web deliver
// It create request model on web request
// and talk to handler (interacter).
// Then create response model on handler response
// and send back to client

var expressRouter = require("express").Router;

function Controller(name, handler) {
  this.router = expressRouter();
  this.name = name;
  this.handler = handler;

  var controller = this;

  this.router.route("/" + name)
    .get(function (req, res, next) {
      // Get all objects
      controller.makeResponse(handler.find, {
        query: req.query
      }, res, next);
    });
};

Controller.prototype.makeResponse = function(promise, requestModel, res, next) {
  if (promise) {
    promise.call(this.handler, requestModel)
      .then(function (result) { res.json(result) })
      .catch(function (error) { next(error); });
  } else {
    next();
  }
};

module.exports = Controller;
