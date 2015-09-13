var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  geometry: {
    type: { type: String, default: "Polygon", required: true },
    coordinates: { type: [[Number]] }
  }
}, {
  id: true,
  strict: false
});

LocationSchema.set('toObject', { getters: true });

try{
  LocationSchema.index({ "geometry": "2dsphere" });
} catch(e){
  console.error(e);
}

var Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
