global.$ = require("../../global.js");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");
var should = require("should"); 
describe("MaePaySoh API", function () {
  describe("#getToken()", function () {
    it("should return host for candidates", function (done) {
      MaePaySohAPI.getToken()
        .then(function (token) {
          token.should.be.a.String();
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });
  describe("MaePaySoh.candidate", function(){
    var totalCandidate;
    describe("#getList()", function(){
      it("should return list of candidate", function(done){
        this.timeout(4000);
        MaePaySohAPI.candidate.getList()
          .then(function (data){
            totalCandidate = data.pagin.total;
            done();
          })
          .catch(function (err) {
            done(err);
          });
      });
    });
    describe("#getAll()", function(){
      it("should return full list of candidates", function(done){
        this.timeout(4000);
        MaePaySohAPI.candidate.getAll()
          .then(function (candidates) {
            candidates.length.should.equal(totalCandidate);
            done();
          })
          .catch(function (err) {
            done(err);
          });
      });
    });
  });
  describe("MaePaySoh.party", function(){
    describe("#getList()", function(){
      it("should return list of candidate", function(done){
        this.timeout(4000);
        MaePaySohAPI.party.getList()
          .then(function (data){
            done();
          })
          .catch(function (err) {
            done(err);
          });
      });
    });
  });
});
