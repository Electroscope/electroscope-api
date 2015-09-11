require("./pre.js");
var should = require("should");
var assert = require("assert");

var Handler = $.rootRequire("api/handlers");
var TestModel = require("./pre/testmodel.js");

var TestHandler = new Handler(TestModel);

describe("TestHandler Handler CRUD test", function () {
  
  before(function () {
    TestModel.remove({}, x => x);
  });

  describe("#create()", function () {
    it("should return an new item", function (done) {
      TestHandler.create({
        data: { name: "Aung Aung", party_id: "2" }
      })
      .then(function (item) { 
        assert(item.name === "Aung Aung");
        done(); 
      })
      .catch(function (error) { done(error); });
    });
  });

  describe("#find()", function () {
    before(function () {
      TestModel.create([
          { name: "Tun Tun", party_id: "0" },
          { name: "Mya Mya", party_id: "1" },
          { name: "Hla Hla", party_id: "0" }
        ]);
    });

    it("should return 2 specific items", function (done) {
      TestHandler.find({
        query: { party_id: "0" }
      })
      .then(function (items) { 
        assert.equal(items.length, 2);
        done(); 
      })
      .catch(function (error) { done(error); });
    });

  });
  
  describe("#findOne()", function () {
    it("should return Aung Aung", function (done) {
      TestHandler.findOne({
        query: { name: "Aung Aung" }
      })
      .then(function (item) { 
        assert.equal(item.name, "Aung Aung");
        done(); 
      })
      .catch(function (error) { done(error); });
    });
  });

  describe("#remove()", function () {
    it("should remove Aung Aung in database", function (done) {
      TestHandler.remove({
        query: { name: "Aung Aung"}
      }).then(function () { 
        TestHandler.findOne({
          query: { name: "Aung Aung" }
        }).then(function (result) {
          should(result).equal(null);
          done();
        }).catch(function (error) { done(error); }); 
      })
      .catch(function (error) { done(error); });
    });
  });
  
});
