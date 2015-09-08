var Candidate = $.rootRequire("api/models/candidate");

var CandidateHandler = {
  create: function (request) {
    var data = request.data;
    return new Promise(function (resolve, reject) {
      (new Candidate(data)).save(function (err, candidate) {
        if (err) {
          reject(err);
        } else {
          resolve(candidate);
        }
      });
    });
  },
  update: function (request) {
    var query = request.query;
    var data = request.data;
    return new Promise(function (resolve, reject) {
      Candidate.findOneAndUpdate(query, {$set: data}, {new: true})
        .exec(function (err, candidate) {
          if (err) {
            reject(err);
          } else {
            resolve(candidate);
          }
        });
    });
  },
  get: function (request) {
    var query = request.query;
    return new Promise(function (resolve, reject) {
      Candidate.find(query)
        .exec(function (err, candidates) {
          if (err) {
            reject(err);
          } else {
            resolve(candidates);
          }
        });
    });
  },
  getOne: function (request) {
    var query = request.query;
    return new Promise(function (resolve, reject) {
      Candidate.findOne(query)
        .exec(function (err, candidates) {
          if (err) {
            reject(err);
          } else {
            resolve(candidates);
          }
        });
    });
  },
  remove: function (request) {
    var query = request.query;
    return new Promise(function (resolve, reject) {
      Candidate.remove(query)
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

module.exports = CandidateHandler;
