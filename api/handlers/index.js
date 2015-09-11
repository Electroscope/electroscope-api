/**
 * Basically, the Handler Class is collection of CRUD process on 
 * the model. When you want to remove or disable one 
 * default method of Handler Class, just define as null.
 *
 * *Nature of methods in Handler*
 *
 * Methods in Handler are work as asynchronous and return Promise.
 * Methods will only accept a request model in first param and
 * dance with it.
 * 
 */

const SINGLE_UPDATE_METHOD_NAME = "fundOneAndUpdate";
const MULTI_UPDATE_METHOD_NAME = "update";

var Handler = function (model) {
  this.model = model;
};

Handler.createQueryOption = function (query) {
  if (query.id) {
    query._id = query.id;
    delete query.id;
  }
  return query;
};

Handler.prototype = {
  /**
   * Create object[s] and save them to database 
   * request.data will be use as raw data of creation of object[s] 
   *
   * @request.data Must be an Object {} for single Object creation
   * @request.data Must be an Array of Objects [{}] 
   * for multipal creation
   *
   * @Promise#reslove Created object[s]
   */
  create: function (request) {
    var handler = this;
    var data = request.data;
    return new Promise(function (resolve, reject) {
      (new handler.model(data)).save(function (err, doc) {
        if (err) {
          reject(err);
        } else {
          resolve(doc.toObject());
        }
      });
    });
  },
  /**
   * Get the list of object match with query
   * @request.query Query option of find match objects 
   *
   * @Promise#reslove Array of objects
   */ 
  find: function (request) {
    var handler = this;
    var query = Handler.createQueryOption(request.query);
    return new Promise(function (resolve, reject) {
      handler.model.find(query).lean()
        .exec(function (err, docs) {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        });
    });
  },
  /**
   * Get the specific object match with query
   * @request.query Query option
   * 
   * @Promise#reslove The Single object or null
   */
  findOne: function (request) {
    var handler = this;
    var query = Handler.createQueryOption(request.query);
    return new Promise(function (resolve, reject) {
      handler.model.findOne(query).lean()
        .exec(function (err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc || null);
          }
        });
    });
  },
  /**
   * Update object[s] match with query
   * 
   * @request.query Query option
   * @request.body Data of update path
   * @request.multi [boolean] Multi update of single update
   *
   * @Promise#reslove Updated object[s]
   */ 
  update: function (request) {
    var handler = this;
    var query = Handler.createQueryOption(request.query);
    var data = request.data;
    var multi = request.multi || false;
    var updateMethodName = !multi ? SINGLE_UPDATE_METHOD_NAME
      : MULTI_UPDATE_METHOD_NAME;

    return new Promise(function (resolve, reject) {
      handler.model[updateMethodName](query, {
        $set: data
      }, {
        new: true,
        multi: multi
      }).lean()
        .exec(function (err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
    });
  },
  /**
   * Remove object[s] match with query
   *
   * @request.query Query option
   * @request.multi Multi option
   *
   * @Promise#reslove {success: true}
   */
  remove: function (request) {
    var handler = this;
    var query = Handler.createQueryOption(request.query);
    var multi = request.multi || false;
    return new Promise(function (resolve, reject) {
      handler.model.remove(query, {
        {multi: multi}
      }).exec(function (err) {
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
