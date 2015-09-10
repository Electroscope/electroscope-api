require("./pre");
var Candidate = $.rootRequire("api/handlers/candidate");
var CandidateModel = $.rootRequire("api/models/candidate");
var assert = require("assert");
var should = require("should");

describe("Candidate Handler CRUD test", function () {
  
  before(function () {
    CandidateModel.remove({}, x => x);
  });

  describe("#create()", function () {
    it("should return an new candidate", function (done) {
      Candidate.create({
        data: { name: "Aung Aung", party_id: "2" }
      })
      .then(function (candidate) { 
        assert(candidate.name === "Aung Aung");
        done(); 
      })
      .catch(function (error) { done(error); });
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

    it("should return 2 specific candidates", function (done) {
      Candidate.get({
        query: { party_id: "0" }
      })
      .then(function (candidates) { 
        assert.equal(candidates.length, 2);
        done(); 
      })
      .catch(function (error) { done(error); });
    });

  });
  
  describe("#getOne()", function () {
    it("should return Aung Aung", function (done) {
      Candidate.getOne({
        query: { name: "Aung Aung" }
      })
      .then(function (candidate) { 
        assert.equal(candidate.name, "Aung Aung");
        done(); 
      })
      .catch(function (error) { done(error); });
    });
  });

  describe("#remove()", function () {
    it("should remove Aung Aung in database", function (done) {
      Candidate.remove({
        query: { name: "Aung Aung"}
      }).then(function () { 
        Candidate.getOne({
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
