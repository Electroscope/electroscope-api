var request = require("request");

function catchError(callback) {
  return function (err, res, body) {
    if (err) {
      return callback(err);
    }
    body = JSON.parse(body);
    var error = body.error || body.errors;
    var status = res.statusCode;

    if (error) {
      return callback(new Error(error.message + ""));
    }

    if (status >= 200 && status < 400) {
      callback(null, body);
    } else {
      callback(new Error("Something wrong"));
    }
  };
}

var MaePaySoh = {
  host: "http://api.maepaysoh.org/",
  key: "09686031113147cf0e36eac34ababfca1c6874e2",
  // cache token
  _token: null,
  
  getToken: function (force) {
    var that = this;
    return new Promise(function (resolve, reject) {
      if (that._token && !force) {
        return resolve(that._token);
      }
      request.post({
        url: that.host + "token/generate",
        form: { api_key: that.key }
      }, catchError(function(err, body) {
        if (err) {
          reject(err);
        } else {
          that._token = body.data.token;
          resolve(body.data.token);
        }
      }));
    });
  },
  getOne: function (collectionUrl, id) {
    var that = this;
    var url = that.host + collectionUrl + "/" + id;
    return new Promise(function (resolve, reject) {
      request.get({
        url: url,
        qs: { token: that._token }
      }, catchError(function (err, body) {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      }));
    });
  },
  getList: function (collectionUrl, query) {
    var that = this;
    var url = that.host + collectionUrl;
    query = query || {};
    query.token = that._token;
    return new Promise(function (resolve, reject) {
      request.get({
        url: url,
        qs: query
      }, catchError(function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }));
    });
  }
};

MaePaySoh.candidate = {
  DETAIL_URL: "candidate",
  LIST_URL: "candidate/list",
  getList: function (page) {
    var that = this;
    return new Promise(function (resolve, reject) {
      MaePaySoh.getList(that.LIST_URL, {page: (page || 1)})
        .then(function (data) {
            resolve({
              candidates: data.data,
              pagin: data.meta.pagination
            });
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },
  getAll: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      function nextPage(candidates, pagin) {
        if (pagin.current_page < pagin.total_pages) {
          that.getList(pagin.current_page + 1)
            .then(function (data){
              nextPage(candidates.concat(data.candidates), 
                  data.pagin)
            })
            .catch(function (err) {
              reject(err)
            });
        } else {
          resolve(candidates);
        }
      }
      nextPage([], {current_page: 0, total_pages: 1});
    });
  }
};

MaePaySoh.party = {
  DETAIL_URL: "party/detail",
  LIST_URL: "party",
  getList: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      MaePaySoh.getList(that.LIST_URL)
        .then(function (data) { 
            resolve({ parties: data.data });
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
};
module.exports = MaePaySoh;
