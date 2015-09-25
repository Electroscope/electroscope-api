var WinnerModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var WinnerHandler = new Handler(WinnerModel);
var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records']);

WinnerHandler.getWinnerCount = function(request) {
  var $match = {};
  var $group = { _id: {}, count: {$sum : 1}};

  $match.year = 2010;
  $match.winner = true;
  //if (request.year) { $match.year = parseInt(request.year); }

  var group_by_list = [];
  if (request.group_by) {
    group_by_list = request.group_by.split(',');
  }

  group_by_list.forEach(function (each) {
    $group._id[each.replace('.', '_')] = '$' + each;
  });

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
      winner: 1
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
    	    count: 1,
    	    party: "$_id.party",
	    state: "$_id.state",
	    state_code: "$_id.state_code"
    	  }
    });

    if (request.$post_pipeline) {
      pipeline = pipeline.concat(request.$post_pipeline);
      pipeline.push({$sort: {total_count: -1}});
    }

    if (request.sort_by) {
      var $sort = {};
      var sort_list = request.sort_by.split(',');
      sort_list.forEach(function (each) {
	$sort[each] =1;
      });
      pipeline.push({$sort: $sort});
    }

    console.info("PIPELINE => ", pipeline);

    db.candidate_records.aggregate(pipeline, function(err, result) {
      if (err) {
    	reject(err);
      } else {
    	resolve(result);
      }
    });
  });
};

WinnerHandler.getWinnerCountByParty = function (query) {
    /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',party': 'party';

  var $group = {
    _id: null,
    party_counts: {$addToSet: {count: "$count", party: '$party'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id: 0,
    party_counts: 1,
    total_count: 1
  };

  if (group_by) {
    $project[group_by] = "$_id";
    $group._id = '$' + group_by;
  }

  query.$post_pipeline = [
    { $group: $group},
    { $project: $project}
  ];

  return WinnerHandler.getWinnerCount(query);
};

WinnerHandler.getByStateCount = function (query) {
    /* if there is no year parameter use 2015 by default */
    /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',state': 'state';

  var $group = {
    _id: null,
    state_counts: {$addToSet: {count: "$count", state: '$state'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id:  0,
    state_counts: 1,
    total_count: 1
  };

  if (group_by) {
    $project[group_by] = "$_id";
    $group._id = '$' + group_by;
  }

  query.$post_pipeline = [
    { $group: $group},
    { $project: $project}
  ];

  return WinnerHandler.getWinnerCount(query);
};

WinnerHandler.getByParliamentCount = function (query) {
    /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',parliament': 'parliament';

  var $group = {
    _id: null,
    parliament_counts: {$addToSet: {count: "$count", parliament: '$parliament'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id: 0,
    parliament_counts: 1,
    total_count: 1
  };

  if (group_by) {
    $project[group_by] = "$_id";
    $group._id = '$' + group_by;
  }

  query.$post_pipeline = [
    { $group: $group},
    { $project: $project}
  ];

  return WinnerHandler.getWinnerCount(query);
}

module.exports = WinnerHandler;
