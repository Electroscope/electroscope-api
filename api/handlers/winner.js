var WinnerModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var WinnerHandler = new Handler(WinnerModel);
var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records']);

WinnerHandler.getCount = function(request) {
  //
  var $match = {};
  var $group = { _id: {}, winners: {$sum : "$winners"}};

  /* Only 2010 data is available */
  $match.year = 2010;
  //if (request.year) { $match.year = parseInt(request.year); }

  // var group_by_list = ['party'];
  // if (request.group_by) {
  //   group_by_list = request.group_by.split(',');
  // }

  // group_by_list.forEach(function (each) {
  //   $group._id[each.replace('.', '_')] = '$' + each;
  // });
  // console.info("GROUPBY => ", $group);

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
      educated: 1, winners: 1
    };

    for (var attr in request.$initial_project) {
      $project[attr] = request.$initial_project[attr];
    }

    pipeline.push({$project: $project});
    pipeline.push({$match: $match});
    pipeline.push({$sort: {votes: 1}});
    pipeline.push({$group: {_id:
			    {constituency: "$constituency",
			     parliament: "$parliament"},
			    party: {$last: "$party" },
			   }});
    pipeline.push({
    	  $project: {
    	    _id: 0,
    	    winners: 1,
    	    party: 1,
    	    parliament: "$_id.parliament",
    	    constituency: "$_id.constituency",
    	    state: "$_id.state",
	    state_code: "$_id.state_code"
    	  }
    });

    db.candidate_records.aggregate(pipeline, function(err, result) {
      if (err) {
    	reject(err);
      } else {
    	resolve(result);
      }
    });
  });
};

module.exports = WinnerHandler;
