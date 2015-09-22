var CandidateModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var CandidateHandler = new Handler(CandidateModel);

var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records', 'party_records']);

CandidateHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.candidate.getAll(function (candidates) {
      console.log(candidates.length + " candidates are got!!");
    }).then(function (candidates) {

      handler.create({
        data: candidates
      }).then(function () {
        console.log(candidates.length
            + " candidates had been saved");
        resolve(candidates);
      }).catch(reject);

    }).catch(reject);
  });
};

CandidateHandler.getCount = function(request) {
  var $match = {};
  var $group = { _id: {}, count: {$sum : 1}};
  /* if there is no year parameter use 2015 by default */
  $match.year = 2015;
  if (request.year) { $match.year = parseInt(request.year); }

  var group_by_list = ['party'];
  if (request.group_by) {
    group_by_list = request.group_by.split(',');
  }

  group_by_list.forEach(function (each) {
    $group._id[each.replace('.', '_')] = '$' + each;
  });
  console.info("GROUPBY => ", $group);

  /* optional parameters */
  if (request.party) { $match.party = request.party; }
  if (request.constituency) { $match.constituency = request.constituency; }
  if (request.parliament) { $match.parliament = request.parliament; }

  return new Promise(function (resolve, reject) {
    var pipeline = [];
    pipeline.push({$match: $match});
    pipeline.push({$group: $group});
    pipeline.push({
	  $project: {
	    _id: 0,
	    count: 1,
	    party: "$_id.party",
	    parliament: "$_id.parliament",
	    constituency: "$_id.constituency",
	    gender: "$_id.candidate_gender"
	  }
    });

    if (request.$extra_pipeline) {
      pipeline = pipeline.concat(request.$extra_pipeline);
    }

    db.candidate_records.aggregate(pipeline, function(err, result) {
      if (err) {
    	reject(err);
      } else {
    	resolve(result);
      }
    });
  });
};

CandidateHandler.getGenderCount = function(query){
  /* Support only 2015 right now */
  query.year = 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',candidate.gender': 'candidate.gender';

  var $group = {
    _id: null,
    gender_counts: {$addToSet: {count: "$count", gender: '$gender'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id: 0,
    gender_counts: 1,
    total_count: 1
  };

  if (group_by) {
    $project[group_by] = "$_id";
    $group._id = '$' + group_by;
  }

  query.$extra_pipeline = [
    { $match: {gender: {$in : [ 'M', 'F']}} } ,
    { $group: $group},
    { $project: $project}
  ];

  return CandidateHandler.getCount(query);
};

CandidateHandler.getPartyCount = function (query) {
    /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = 'party,parliament'; // 'party'

  var $group = {
      _id: '$party',
      parliament_counts: {$addToSet: {count: "$count", parliament: '$parliament'}},
      total_count: {$sum: '$count'}
    };

  var $project = {
      party: '$_id',
      _id: 0,
      parliament_counts: 1,
      total_count: 1
    };

  query.$extra_pipeline = [
    { $group: $group},
    { $project: $project}
  ];

  return CandidateHandler.getCount(query);
};

module.exports = CandidateHandler;
