var CandidateModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var CandidateHandler = new Handler(CandidateModel);

var mongojs = require("mongojs");
var db = mongojs('electroscope', ['candidate_records', 'parties']);

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
    $group._id[each] = '$' + each;
  });

  /* optional parameters */
  if (request.party) { $match.party = request.party; }
  if (request.constituency) { $match.constituency = request.constituency; }
  if (request.parliament) { $match.parliament_code = request.parliament; }

  return new Promise(function (resolve, reject) {
    db.candidate_records.aggregate(
      [
    	{$match: $match},
    	{$group: $group},
	{
	  $project: {
	    _id: 0,
	    count: 1,
	    party: "$_id.party",
	    parliament: "$_id.parliament_code",
	    constituency: "$_id.constituency"
	  }
	}
      ],
      function(err, result) {
    	if (err) {
    	  reject(err);
    	} else {
    	  resolve(result);
    	}
      });
  });
};

CandidateHandler.getLocations = function (request) {
  var model = this.model;
  var query = request.query;
  var $match = {
    "constituency.ST_PCODE": { $ne: null },
    "constituency.DT_PCODE": { $ne: null }
  };

  if (query) {
    if (query.legislature)
      $match.legislature = LEGISLATURES[query.legislature];

    if (query.state)
      $match.state = query.state;

    if (query.st_pcode)
      $match["constituency.ST_PCODE"] = query.st_pcode;

    if (request.dt_pcode)
      $match["constituency.DT_PCODE"] = query.dt_pcode;
  }

  return new Promise(function (resolve, reject) {
    model.aggregate([
      {
        $match: $match
      },
      {
        $group: {
          _id: {
            legislature: "$legislature",
            st_code: "$constituency.ST_PCODE",
            st_name: "$constituency.parent",
            dt_code: "$constituency.DT_PCODE",
            dt_name: "$constituency.name"
          },
          candidates: { $sum: 1 },
        }
      },
      { $sort: {"_id.dt_name": -1}},
      {
        $group: {
          _id: {
            legislature: "$_id.legislature",
            st_code: "$_id.st_code",
            st_name: "$_id.st_name",
          },
          districts: {
            $addToSet: {
              DT_PCODE: "$_id.dt_code",
              name: "$_id.dt_name",
              candidates: "$candidates"
            }
          }
        }
      },
      { $sort: {"_id.st_name": -1}},
      {
        $group: {
          _id: "$_id.legislature",
          states: {
            $addToSet: {
              ST_PCODE: "$_id.st_code",
              name: "$_id.st_name",
              districts: "$districts"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          legislature: "$_id",
          name: "$_id",
          states: "$states"
        }
      }
    ]).exec(function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

CandidateHandler.getCandidateCountPerConstituency = function(query){
  var model = this.model;
  var match = {};
  var firstGrouping = {};
  match.legislature = LEGISLATURES[query.legislature];
  if(query.legislature === "lower_house" || query.legislature === "upper_house"){
    firstGrouping = {
      _id: {
        legislature: "$legislature",
        state: "$constituency.parent",
        constituency_pcode: "$constituency.TS_PCODE",
        constituency_name: "$constituency.name",
        constituency_number: "$constituency.number",
        constituency_type: "Township"
      },
      candidatesCount: {$sum: 1}
    };
  }else{
    firstGrouping = {
      _id: {
        legislature: "$legislature",
        state: "$constituency.parent",
        constituency_pcode: "$constituency.AM_PCODE",
        constituency_name: "$constituency.name",
        constituency_number: "$constituency.number",
        consituency_type: "Custom"
      },
      candidatesCount: {$sum: 1}
    };
  }
  return new Promise(function(resolve, reject){
    model.aggregate([
    {
      $match: match
    },
    {
      $group: firstGrouping
    },
    {
      $project: {
        _id: 0,
        legislature: "$_id.legislature",
        state: "$_id.state",
        constituency_pcode: "$_id.constituency_pcode",
        constituency_name: "$_id.constituency_name",
        constituency_number: "$_id.constituency_number",
        consituency_type: "$_id.constituency_type",
        candidates_count: "$candidatesCount"

      }
    }
    ]).exec(function (err, result){
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

CandidateHandler.groupbyLegislatureStateDistrict = function (query) {
  var model = this.model;
  var match = {};

  if (query.legislature) {
    match.legislature = query.legislature;
  }
  if (query.state){
    match.state = query.state;
  }
  if (query.constituency) {
    match.constituency = query.constituency;
  }

  return new Promise(function (resolve, reject) {
    model.aggregate([{
      $match: match
    },
    {
      $group: {
        _id: {
          legislature: "$legislature",
          state: "$constituency.parent",
          constituency: "$constituency.name"
        },
        candidates: { $push: "$$ROOT" },
        candidatesCount: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: {
          legislature: "$_id.legislature",
          state: "$_id.state",
        },
        constituencies: {
          $addToSet: {
            name: "$_id.constituency",
            candidates: "$candidates",
            candiaatesCount: "$candidatesCount"
          }
        }
      }
    },
    {
      $group: {
        _id: "$_id.legislature",
        states: {
          $addToSet: {
            name: "$_id.state",
            constituencies: "$constituencies"
          }
        }
      }
    }]).exec(function (err, result){
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

CandidateHandler.partyCandidateCountByStates = function(query){
  var model = this.model;
  var match = {};


  if (query.legislature) {
    match.legislature = LEGISLATURES[query.legislature];
  }
  if (query.state){
    match["constituency.parent"] = query.state;
  }
  if (query.st_pcode) {
    match["constituency.ST_PCODE"] = query.st_pcode;
  }

  console.log("Match", match);

  return new Promise(function (resolve, reject) {
    model.aggregate([
    {
      $match: match
    },
    {
      $group: {
        _id: {
          legislature: "$legislature",
          st_pcode: "$constituency.ST_PCODE",
          state: "$constituency.parent",
          party_id: "$party_id"
        },
        candidatesCount: {$sum: 1}
      },
    },
    {
      $project: {
        _id: 0,
        legislature: "$_id.legislature",
        state: "$_id.state",
        st_pcode: "$_id.st_pcode",
        party_number: "$_id.party_id",
        candidatesCount: "$candidatesCount"
      }
    },
    {
      $sort: {
        st_pcode: -1
      }
    }
    ]).exec(function (err, result){
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = CandidateHandler;
