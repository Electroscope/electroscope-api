var Party = $.rootRequire("api/models/party");

var PartyHandler = {
  create: function (request) {
    var data = request.data;
    return new Promise(function (resolve, reject) {
      (new Party(data)).save(function (err, party) {
        if (err) {
          reject(err);
        } else {
          resolve(party);
        }
      });
    });
  },
  update: function (request) {
    var query = request.query;
    var data = request.data;
    return new Promise(function (resolve, reject) {
      Party.findOneAndUpdate(query, {$set: data}, {new: true})
        .exec(function (err, party) {
          if (err) {
            reject(err);
          } else {
            resolve(party);
          }
        });
    });
  },
  get: function (request) {
    var query = request.query;
    return new Promise(function (resolve, reject) {
      Party.find(query)
        .exec(function (err, parties) {
          if (err) {
            reject(err);
          } else {
            resolve(parties);
          }
        });
    });
  },
  getOne: function (request) {
    var query = request.query;
    return new Promise(function (resolve, reject) {
      Party.findOne(query)
        .exec(function (err, parties) {
          if (err) {
            reject(err);
          } else {
            resolve(parties);
          }
        });
    });
  },
  remove: function (request) {
    var query = request.query;
    return new Promise(function (resolve, reject) {
      Party.remove(query)
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

module.exports = PartyHandler;
