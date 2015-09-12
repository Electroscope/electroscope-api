var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TestSchema = new Schema({

}, {
  id: true,
  strict: false
});

TestSchema.set('toObject', { 
  getters: true,
  transform: function (doc, ret, options) {
    doc.id = doc._id;
  }
});

TestModel = mongoose.model("Test", TestSchema);

module.exports = TestModel;
