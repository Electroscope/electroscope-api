var VoteModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var VoteHandler = new Handler(VoteModel);
var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records', 'party_records']);

VoteHandler.getCount = function(request) {
  var $match = {};
  var $group = { _id: {}, votes: {$sum : "$votes"}};

  /* Only 2010 data is available */
  $match.year = 2010;
  //if (request.year) { $match.year = parseInt(request.year); }

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
  if (request.state) { $match.state = request.state; }
  if (request.state_code) { $match.state_code = request.state_code; }
  if (request.constituency) { $match.constituency = request.constituency; }
  if (request.parliament) { $match.parliament = request.parliament; }

  return new Promise(function (resolve, reject) {
    var pipeline = [];

    var $project = {
      constituency: 1, parliament: 1, party: 1,
      year: 1, candidate:1, _id: 0, state: 1, state_code: 1,
      educated: 1, votes: 1
    };

    for (var attr in request.$initial_project) {
      $project[attr] = request.$initial_project[attr];
    }

    pipeline.push({$project: $project});
    pipeline.push({$match: $match});
    pipeline.push({$group: $group});

    pipeline.push({
    	  $project: {
    	    _id: 0,
    	    votes: 1,
    	    party: "$_id.party",
    	    parliament: "$_id.parliament",
    	    constituency: "$_id.constituency",
    	    gender: "$_id.candidate_gender",
    	    ethnicity: "$_id.candidate_ethnicity",
    	    naythar: "$_id.candidate_naythar",
    	    religion: "$_id.candidate_religion",
    	    agegroup: "$_id.agegroup",
    	    state: "$_id.state",
	    state_code: "$_id.state_code",
    	    educated: "$_id.educated"
    	  }
    });

    if (request.$post_pipeline) {
      pipeline = pipeline.concat(request.$post_pipeline);
      pipeline.push({$sort: {total_votes: -1}});
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

VoteHandler.getByPartyCount = function (query) {
    /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',party': 'party';

  var $group = {
    _id: null,
    party_counts: {$addToSet: {votes: "$votes", party: '$party'}},
    total_votes: {$sum: '$votes'}
  };

  var $project =  {
    _id: 0,
    party_counts: 1,
    total_votes: 1
  };

  if (group_by) {
    $project[group_by] = "$_id";
    $group._id = '$' + group_by;
  }

  query.$post_pipeline = [
    { $group: $group},
    { $project: $project}
  ];

  return VoteHandler.getCount(query);
};

VoteHandler.getByParliamentCount = function (query) {
    /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',parliament': 'parliament';

  var $group = {
    _id: null,
    parliament_counts: {$addToSet: {votes: "$votes", parliament: '$parliament'}},
    total_votes: {$sum: '$votes'}
  };

  var $project =  {
    _id: 0,
    parliament_counts: 1,
    total_votes: 1
  };

  if (group_by) {
    $project[group_by] = "$_id";
    $group._id = '$' + group_by;
  }

  query.$post_pipeline = [
    { $group: $group},
    { $project: $project}
  ];

  return VoteHandler.getCount(query);
};

VoteHandler.getByStateCount = function (query) {
    /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',state': 'state';

  var $group = {
    _id: null,
    state_counts: {$addToSet: {votes: "$votes", state: '$state'}},
    total_votes: {$sum: '$votes'}
  };

  var $project =  {
    _id: 0,
    state_counts: 1,
    total_votes: 1
  };

  if (group_by) {
    $project[group_by] = "$_id";
    $group._id = '$' + group_by;
  }

  query.$post_pipeline = [
    { $group: $group},
    { $project: $project}
  ];

  return VoteHandler.getCount(query);
};

module.exports = VoteHandler;
