/**
 * Basically The master Handler make default CRUD process of
 * each model
 * If you want to remove or disable one of this feature,
 * you just overwrite with null
 * Example: If you want to remove delete method, just overwrite it
 * null
 */
var Handler = function (model) {
  this.model = model;
};

Handler.prototype = {
  create: function (request) {
    var self = this;
    var data = request.data;
    return new Promise(function (resolve, reject) {
      (new self.model(data)).save(function (err, doc) {
        if (err) {
          reject(err);
        } else {
          resolve(doc.toObject());
        }
      });
    });
  },
  update: function (request) {
    var self = this;
    var query = request.query;
    var data = request.data;
    return new Promise(function (resolve, reject) {
      self.model.findOneAndUpdate(query, {$set: data}, {new: true}).lean()
        .exec(function (err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
    });
  },
  get: function (request) {
    var self = this;
    var query = request.query;
    return new Promise(function (resolve, reject) {
      self.model.find(query).lean()
        .exec(function (err, docs) {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        });
    });
  },
  getOne: function (request) {
    var self = this;
    var query = request.query;
    return new Promise(function (resolve, reject) {
      self.model.findOne(query).lean()
        .exec(function (err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
    });
  },
  remove: function (request) {
    var self = this;
    var query = request.query;
    return new Promise(function (resolve, reject) {
      self.model.remove(query)
        .exec(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({succes: true});
          }
        });
    });
  }
};

module.exports = Handler;
