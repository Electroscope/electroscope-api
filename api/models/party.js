var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PartySchema = new Schema({
}, {strict: false});

PartySchema.set("toObject", { getters: true });

var Party = mongoose.model("Party", PartySchema);

module.exports = Party;
