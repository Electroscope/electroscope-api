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

const UPDATE_METHOD_SINGLE = "findOneAndUpdate";
const UPDATE_METHOD_MULTI = "update";

function Handler(model) {
  this.model = model;
  return this;
}

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
    var model = this.model;
    var data = request.data;
    return new Promise(function (resolve, reject) {
      model.create(data, function (err, items) {
        if (err) {
          reject(err);
        } else {
          if (items.map) {
            items = items.map(item => item.toObject());
          }
          resolve(items);
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
    var model = this.model;
    var query = Handler.createQueryOption(request.query);
    return new Promise(function (resolve, reject) {
      model.find(query)
        .exec(function (err, docs) {
          if (err) {
            reject(err);
          } else {
            resolve(docs.map( doc => doc.toObject()));
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
    var model = this.model;
    var query = Handler.createQueryOption(request.query);
    return new Promise(function (resolve, reject) {
      model.findOne(query)
        .exec(function (err, doc) {
          if (err) {
            reject(err);
          } else {
            doc = doc ? doc.toObject() : null;
            resolve(doc);
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
   * @Promise#reslove Updated object for single update or
   * {success: true}
   */ 
  update: function (request) {
    var model = this.model;
    var query = Handler.createQueryOption(request.query);
    var data = request.data;
    var multi = request.multi || false;
    var updateMethodName = !multi ? UPDATE_METHOD_SINGLE
      : UPDATE_METHOD_MULTI;

    return new Promise(function (resolve, reject) {
      model[updateMethodName](query, {
        $set: data
      }, {
        new: true,
        multi: multi
      }).exec(function (err, doc) {
        if (err) {
          reject(err);
        } else if (multi) {
          resolve({succes: true});
        } else {
          doc = doc ? doc.toObject() : doc;
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
    var model = this.model;
    var query = Handler.createQueryOption(request.query);
    return new Promise(function (resolve, reject) {
      model.remove(query)
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
