var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PartySchema = new Schema({
  dataCollectionYear: {type: String}
}, {strict: false});

PartySchema.set("toObject", { getters: true });

var Party = mongoose.model("Party", PartySchema);

module.exports = Party;
