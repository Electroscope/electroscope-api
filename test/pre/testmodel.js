var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TestSchema = new Schema({

}, {strict: false});

TestSchema.set('toObject', { getters: true });

var TestModel = mongoose.model("Test", TestSchema);

module.exports = TestModel;
