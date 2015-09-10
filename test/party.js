require("./pre");
var Party = $.rootRequire("api/handlers/party");
var PartyModel = $.rootRequire("api/models/party");
var assert = require("assert");
var should = require("should");

describe("Party Handler CRUD test", function () {
  
  before(function () {
    PartyModel.remove({}, x => x);
  });

  describe("#create()", function () {
    it("should return an new party", function (done) {
      Party.create({
        data: { name: "Aung Aung", party_id: "2" }
      })
      .then(function (party) { 
        assert(party.name === "Aung Aung");
        done(); 
      })
      .catch(function (error) { done(error); });
    });
  });

  describe("#get()", function () {
    before(function () {
      PartyModel.create([
          { name: "Tun Tun", party_id: "0" },
          { name: "Mya Mya", party_id: "1" },
          { name: "Hla Hla", party_id: "0" }
        ]);
    });

    it("should return 2 specific parties", function (done) {
      Party.get({
        query: { party_id: "0" }
      })
      .then(function (parties) { 
        assert.equal(parties.length, 2);
        done(); 
      })
      .catch(function (error) { done(error); });
    });

  });
  
  describe("#getOne()", function () {
    it("should return Aung Aung", function (done) {
      Party.getOne({
        query: { name: "Aung Aung" }
      })
      .then(function (party) { 
        assert.equal(party.name, "Aung Aung");
        done(); 
      })
      .catch(function (error) { done(error); });
    });
  });

  describe("#remove()", function () {
    it("should remove Aung Aung in database", function (done) {
      Party.remove({
        query: { name: "Aung Aung"}
      }).then(function () { 
        Party.getOne({
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
