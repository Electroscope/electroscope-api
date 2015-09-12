require("./pre");
var should = require("should");

var Handler = $.rootRequire("api/handlers");
var TestModel = require("./pre/testmodel.js");

var TestHandler = new Handler(TestModel);

describe("TestHandler Handler CRUD test", function () {
  
  var aungaung = { name: "Aung Aung", age: 24 };
  var tuntun = { name: "Tun Tun", age: 23 };
  var myamya = { name: "Mya Mya", age: 22 };
  var hlahla = { name: "Hla Hla", age: 22 };

  before(function () {
    TestModel.remove({}, x => x);
  });

  describe("#create() single creation", function () {
    it("should return an new item", function () {
      return TestHandler.create({
        data: aungaung
      })
      .then(function (item) { 
        item.should.have.property("id").which.is.a.String();
        item.should.have.property("name", "Aung Aung");
      })
    });
  });

  describe("#create() multi creation", function () {
    var result;
      
    before(function () {
      return TestHandler.create({
        data: [tuntun, myamya, hlahla]
      }).then( items => result = items );
    });

    it("each should contain id", function () {
      result.forEach( item => item.should.have.property("id"));
    });

    it("should have 3 length", function(){
      result.should.have.length(3);
    });

    it("should contain all three peoples", function(){
      result.should.containDeep([tuntun, myamya, hlahla]);
    });
    
  });

  describe("#find()", function () {

    var result;

    before(function () {
      return TestHandler.find({
        query: { age: 22 }
      }).then(function (items) {
        result = items;
      });
    });

    it("each should contain id", function () {
      result.forEach( item => item.should.have.property("id"));
    });

    it("should return 2 person", function () {
      result.should.have.length(2);
    });

    it("should return 2 person definately", function () {
      result.should.containDeep([myamya, hlahla]);
    });
  });
  
  describe("#findOne()", function () {
    it("should return Aung Aung", function () {
      return TestHandler.findOne({
        query: { name: "Aung Aung" }
      })
      .then(function (item) { 
        item.should.containDeep(aungaung);
      });
    });
  });

  describe("#update()", function () {
    var result;

    before(function () {
      return TestHandler.update({
        query: { age: 22 },
        data: { youngest: true },
        multi: true
      }).then(function (items) {
        return TestHandler.find({
          query: { youngest: true }
        }).then(function (items) {
          result = items;
        });
      });
    });

    it("each should contain id", function () {
      result.forEach( item => item.should.have.property("id"));
    });

    it("should return 2 person", function () {
      result.should.have.length(2);
    });

    it("should return 2 person definately", function () {
      result.should.containDeep([myamya, hlahla]);
      result.should.containDeep([{youngest: true}]);
    });

  });
  
  describe("#remove()", function () {
    
    before(function () {
      return TestHandler.remove({
        query: { age: 22 }
      });
    });
    
    it("should remove all age 22 person", function () {
      return TestHandler.findOne({
        query: { name: 22 }
      }).then(function (result) {
        should(result).equal(null);
      });
    });
  });
  
});
