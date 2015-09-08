/**
 * Handler Class
 * @param NSmodel[String]: The name of model which mainly use on controller
 * @param Option[Object]: The option
 */

"use strick";
function Handler(NSmodel, Option){

  if(this instanceof Handler){
    try{
      this.model = require('../models/' + NSmodel.toLowerCase());
    }catch(err){
      console.error(err);
    }
    this.nsmodel = NSmodel;
    this.plural = NSmodel.toLowerCase() + "s";
  } else {
    return new Handler(NSmodel, Option);
  }

}

Handler.prototype =  {

  /**
   * Saving reality object
   * @param object[ModelObject]: the model object
   * @param data[Object]: Filtered conditions with `write` rules
   * @param callback[Function]: Callback function
   * @param extension[Function]: Extension function
   *
   */
  _save: function(object, data, callback, extension){

    /* _save method got Application permission */
    var keys = this.model.defs._app, key;

    for(key in data){
      if(keys.indexOf(key) !== -1)
        object[key] = data[key];
    }

    /* It there is `Before` Function provided, Object will not save here */
    if(this.beforeSave)
      return this.beforeSave(object, data, conditions, callback, extension);

    /* It there is `Extension` Function provided, Object will not save here */
    if(typeof extension === 'function')
      return extension(object, data, conditions, callback);

    object.save(callback);
  },

  /**
   * SetValue will define write permitted value on model
   * @param object[Object]: The Model Object or condition
   * @param data[Object]: The Raw database
   * @return [Object]: Formated Object or Condition
   */
  _setValues: function(object, data){
    var keys = this.model.defs.write, key;
    for(key in data){
      if(keys.indexOf(key) !== -1)
        object[key] = data[key];
    }
    return object;
  },

  /**
   * Model Creator
   * This will also automatically save and then execute callback
   * @param data[Object]: Raw data on new model, eg: req.body
   * @param callback[Function]: The callback function
   * @param extension[Function]: The extension function which will execute before save,
   *        When extension is include, new model will not save.
   *
   */
  create: function(data, callback, extension){
    var object = new this.model();
    conditions = this._setValues({}, data);

    this._save(object, conditions, callback, extension);
  },

  /**
   * Model Updater
   * This will also automatically save and then execute callback
   * @param object[Object]: The object
   * @param data[Object]: Raw data on new model, eg: req.body
   * @param callback[Function]: The callback function
   * @param extension[Function]: The extension function which will execute before save,
   *        When extension is include, new model will not save.
   *
   */
  update: function(conditions, data, callback, extension){
    var that = this;
    var object;

    if(typeof conditions === "string"){
      // When passed an ID
      conditions = { "_id": conditions };
    } else if (conditions instanceof this.model){
      // When passed an model object
      object = conditions;
    } else if(typeof conditions === "object") {
      delete conditions.__v;
    }

    if(object)
      return this._save(object, data, callback, extension);

    this.model.findOne(conditions, function(err, object){
      if(err){
        return callback(err);
      } else if(!object) {
        err = new Error(that + " not found!");
        err.status = 404;
        return callback(err);
      } else {
        return that._save(object, data, callback, extension);
      }
    });
  },

  /* Removing or Deleting */
  remove: function(conditions, callback){

  }

};

module.exports = Handler;
