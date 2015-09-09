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
  }
};

MaePaySoh.candidate = {
  url: MaePaySoh.host + "candidate/list",
  getList: function (page) {
    var that = this;
    return new Promise(function (resolve, reject) {
      request.get({
        url: that.url,
        qs: { token: MaePaySoh._token, page: (page || 1) }
      }, catchError(function (err, body) {
        if (err) {
          reject(err);
        } else {
          resolve({
            candidates: body.data,
            pagin: body.meta.pagination
          });
        }
      }));
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

module.exports = MaePaySoh;
