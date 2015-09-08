/**
 * Global Js is a global tools-kit of usefull functions
 */ 
var joinPath = require("path").join;

module.exports = {
  // Function to require any application specific module 
  // without worried about nested path like ../../../
  rootRequire: function (path) {
    return require(joinPath(__dirname, "/" + path));
  }
};
