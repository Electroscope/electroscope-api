global.$ = require("../global.js");
var mongoose = require("mongoose");
var db = mongoose.connect("localhost/maepaysoh-test");
var Candidate = $.rootRequire("api/handlers/candidate");
var CandidateModel = $.rootRequire("api/models/candidate");
var assert = require("assert");
var should = require("should");

describe("Candidate Handler CRUD test", function () {
  
  before(function () {
    CandidateModel.remove();
  });

  describe("#create()", function () {
    it("should return an new candidate", function (next) {
      Candidate.create({
        data: { name: "Aung Aung", party_id: "2" }
      })
      .then(function (candidate) { 
        assert(candidate.name === "Aung Aung");
        next(); 
      })
      .catch(function (error) { next(error); });
    });
  });

  describe("#get()", function () {

    before(function () {
      CandidateModel.create([
          { name: "Tun Tun", party_id: "0" },
          { name: "Mya Mya", party_id: "1" },
          { name: "Hla Hla", party_id: "0" }
        ]);
    });

    it("should return 2 specific candidates", function (next) {
      Candidate.get({
        query: {party_id: "0"}
      })
      .then(function (candidates) { 
        assert(candidates.length, 2);
        next(); 
      })
      .catch(function (error) { next(error); });
    });

  });
  
  describe("#getOne()", function () {
    it("should return Aung Aung", function (next) {
      Candidate.getOne({
        query: { name: "Aung Aung"}
      })
      .then(function (candidate) { 
        assert(candidate.name === "Aung Aung");
        next(); 
      })
      .catch(function (error) { next(error); });
    });
  });

  describe("#remove()", function () {
    it("should remove Aung Aung in database", function (next) {
      Candidate.remove({
        query: { name: "Aung Aung"}
      }).then(function () { 
        Candidate.getOne({
          query: { name: "Aung Aung" }
        }).then(function (candidate) {
          should(candidate).equal(null);
          next();
        }).catch(function (error) { next(error); }); 
      })
      .catch(function (error) { next(error); });
    });
  });
  
});
