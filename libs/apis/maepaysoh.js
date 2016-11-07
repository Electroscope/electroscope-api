var request = require("request"); 
function catchError(callback) {
  return function (err, res, body) {
    if (err) {
      console.log("error in body");
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
  _token: "db424d6b-80e7-5f3f-bdab-700d4d689dc0",

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
  getOne: function (URL, id) {
    var that = this;
    var url = that.host + URL + "/" + id;
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
  getList: function (URL, query, page) {
    var that = this;
    URL = that.host + URL;
    query = query || {};
    // query.per_page = 200;
    query.token = that._token;
    if (page && !isNaN(page)) {
      query.page = page;
    }
    return new Promise(function (resolve, reject) {
      request.get({
        url: URL,
        qs: query
      }, catchError(function (err, data) {
         console.log("error in body", URL);

        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }));
    });
  },
  getAll: function (URL, query, pipe) {
    var that = this;
    return new Promise(function (resolve, reject) {
      function nextPage(prevData, pagin) {
        pagin = pagin || {current_page: 0, total_pages: 1};
        if (pagin.current_page < pagin.total_pages) {
          that.getList(URL, query, pagin.current_page + 1)
            .then(function(data){
              console.log("Data recurs", query, data.meta);
              if (pipe) { 
                // console.log(pipe, JSON.parse(data));
                pipe(data.data);
              }
              prevData = prevData.concat(data.data);
              nextPage(prevData, data.meta && data.meta.pagination || data._meta);
            })
            .catch(function (err) {
                        console.log("no pagin");

              reject(err);
            });
        } else {
          resolve(prevData);
        }
      }
      nextPage([]);
    });
  }
};


MaePaySoh.candidate = {
  DETAIL_URL: "candidate",
  LIST_URL: "candidate/list",
  getList: function () {
    var that = this;
    return MaePaySoh.getList(that.LIST_URL);
  },
  getAll: function (pipe) {
    var that = this;
    return MaePaySoh.getAll(that.LIST_URL, {}, pipe)
  }
};

MaePaySoh.party = {
  DETAIL_URL: "party",
  LIST_URL: "party",
  getList: function () {
    var that = this;
    return MaePaySoh.getList(that.LIST_URL);
  },
  getAll: function (pipe) {
    var that = this;
    return MaePaySoh.getAll(that.LIST_URL, {}, pipe);
  }
};

MaePaySoh.location = {
  URL: "geo/district",
  getList: function (page) {
    var that = this;
    return new Promise(function (resolve, reject) {
      MaePaySoh.getList(that.URL, { page: (page || 1), per_page: 200 })
        .then(function (data) {
          resolve({
            locations: data.data,
            pagin: data.meta.pagination
          });
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },
  getAll: function (pipe) {
    var that = this;
    return new Promise(function (resolve, reject) {
      function nextPage(locations, pagin) {
        if (pagin.current_page < pagin.total_pages) {
          that.getList(pagin.current_page + 1)
            .then(function (data){
              pipe(data.locations);
              nextPage(locations.concat(data.locations), 
                  data.pagin);
            })
            .catch(function (err) {
              reject(err);
            });
        } else {
          resolve(locations);
        }
      }
      nextPage([], {current_page: 0, total_pages: 1});
    });
  }
};

module.exports = MaePaySoh;
