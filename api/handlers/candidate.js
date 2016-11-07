var CandidateModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var CandidateHandler = new Handler(CandidateModel);

var async = require("async");
var request = require("request");
var mongojs = require("mongojs");
var db = mongojs("electroscope", ["candidate_records", "party_records"]);

MaePaySohAPI.candidate.getAll = function () {
  return new Promise(function (resolve, reject) {
    request.get(
      "https://raw.githubusercontent.com" +
      "/MyanmarAPI/candidate-endpoint/master/storage/data/candidate.json",
      // "http://localhost:3000/candidate.json",
      function (err, resp, body) {
        if (err) { reject (err); }
        var candidates = body.toString().split('\n').map(function (line) {
          try {return JSON.parse(line);}
          catch (err) {return null;}
        });
        resolve(candidates);
      });
  });
};

CandidateHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.candidate.getAll(function (candidates) {
      console.log("RECEIVED: " + candidates.length + " records.");
    }).then(function (candidates) {
      db.collection("candidate_records").drop(function (){
        console.log("DROPPED: Existing records.");
      });

      var candidate_records = [];
      for (var i = 0; i < candidates.length; i += 1) {
        var c = candidates[i];
        if (c == null) { continue; }

        var record = {};
        record.year = 2015;
        record.candidate = {};
        record.candidate.name = c.name;
        record.candidate.religion = c.religion;
        record.candidate.ethnicity = c.ethnicity;
        record.candidate.gender = c.gender;
        record.candidate.birthdate = new Date(c.birthdate.$date);
        record.candidate.age = new Date().getYear() - new Date(c.birthdate.$date).getYear();
        record.candidate.naythar = new Date(c.birthdate.$date).getDay();

        record.party = c.party_id;
        record.parliament = getParliament(c.legislature);
        record.state = getState(c, record.parliament);

        switch (record.parliament) {
          case 'PTH':
            record.constituency = c.constituency.TS_PCODE;
            break;
          case 'AMH':
            record.constituency = c.constituency.AM_PCODE;
            break;
          default:
            record.constituency = c.constituency.TS_PCODE;
        }

        if (!record.constituency) {
          record.constituency = guessConstituency(c);
        }

        if (record.constituency) {
          record.state_code = record.constituency.slice(0, 6);
        } else {
          record.state_code = null;
        }

        record.educated = false;

        var edu = c.education.toLowerCase();

        if (edu.match(/ph\.d|ll\.|b\.|m\.b\.|bvsc|ma|bsc|ဘွဲ့|မဟာ|dip/)) {
          record.educated = true;
        }

        candidate_records.push(record);
      }

      async.map(candidate_records,
        function (item, callback) {
          /* add parliament  and insert */
          console.log(item);
          db.collection('party_records').findOne({__id : item.party}, function(err, doc) {
            if(err) { reject(err); }
            item.party = (doc == null) ? "IC" : doc.code;
            item.party_name = (doc == null) ? "Independent Candidates" : doc.name.en;
            db.collection('candidate_records').insert(item, callback);
          });
        },
        function (err, results) {
          if (err) { reject(err); }
          resolve(candidate_records);
        }
      );
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
      educated: 1
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
        parliament: "$_id.parliament",
        constituency: "$_id.constituency",
        gender: "$_id.candidate_gender",
        ethnicity: "$_id.candidate_ethnicity",
        religion: "$_id.candidate_religion",
        agegroup: "$_id.agegroup",
      state: "$_id.state",
      state_code: "$_id.state_code",
      educated: "$_id.educated"
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

CandidateHandler.getByGenderCount = function(query){
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

  query.$post_pipeline = [
    { $match: {gender: {$in : [ 'M', 'F']}} } ,
    { $group: $group},
    { $project: $project}
  ];

  return CandidateHandler.getCount(query);
};

CandidateHandler.getByPartyCount = function (query) {
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

  console.log(query);

  return CandidateHandler.getCount(query);
};

CandidateHandler.getEducatedCount = function (query) {
  /* if there is no year parameter use 2015 by default */
  query.year = query.year || 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',educated': 'educated';

  var $group = {
    _id: null,
    educated_counts: {$addToSet: {count: "$count", educated: '$educated'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id: 0,
    educated_counts: 1,
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

  return CandidateHandler.getCount(query);
};

CandidateHandler.getByParliamentCount = function (query) {
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

  return CandidateHandler.getCount(query);
};

CandidateHandler.getByStateCount = function (query) {
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

  return CandidateHandler.getCount(query);
};

CandidateHandler.getByEthnicityCount = function (query) {
  query.year = 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',candidate.ethnicity': 'candidate.ethnicity';

  var $group = {
    _id: null,
    ethnicity_counts: {$addToSet: {count: "$count", ethnicity: '$ethnicity'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id: 0,
    ethnicity_counts: 1,
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

  return CandidateHandler.getCount(query);
};

CandidateHandler.getByReligionCount = function (query) {
  query.year = 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',candidate.religion': 'candidate.religion';

  var $group = {
    _id: null,
    religion_counts: {$addToSet: {count: "$count", religion: '$religion'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id: 0,
    religion_counts: 1,
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

  return CandidateHandler.getCount(query);
};

CandidateHandler.getByAgegroupCount = function (query) {
  query.year = 2015;
  var group_by = query.group_by;
  query.group_by = group_by ?  group_by + ',agegroup': 'agegroup';

  query.$initial_project = {
    agegroup: {
      $cond: [{ $lt: [ "$candidate.age", 30 ] }, '20-30',
        {$cond: [{ $lt: [ "$candidate.age", 40 ] }, '30-40',
           {$cond: [{ $lt: [ "$candidate.age", 50 ] }, '40-50',
        {$cond: [{ $lt: [ "$candidate.age", 60 ] }, '50-60',
          '60+']}
             ]}]}]
    }};

  var $group = {
    _id: null,
    agegroup_counts: {$addToSet: {count: "$count", agegroup: '$agegroup'}},
    total_count: {$sum: '$count'}
  };

  var $project =  {
    _id: 0,
    agegroup_counts: 1,
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

  return CandidateHandler.getCount(query);
};

function guessConstituency(candidate) {
  var towncodes = require('./constituency-code.json');
  var location = candidate.constituency.name;

  if (location.indexOf("တိုင်းရင်းသားလူမျိုး") > -1 ) {
    var region = candidate.constituency.parent;
    region = region.replace('ပြည်နယ်','');
    region = region.replace('တိုင်းဒေသကြီး','');
    return towncodes[region];
  }

  location = location.replace('မဲဆန္ဒနယ်', '');
  location = location.replace('မဲဆန္ဒ���ယ်', '');
  location = location.replace('မ���ဆန္ဒနယ်', '');
  location = location.replace('မြို့နယ်', '');

  return towncodes[location];
};

function getParliament(candidate) {
  if (candidate.match(/ပြည်နယ်|တိုင်း/)) {
    return "RGH";
  } else if (candidate.match(/ပြည်သူ/)) {
    return "PTH";
  } else if (candidate.match(/အမျိုးသား/)) {
    return "AMH";
  } else {
    return null;
  }
};

function getState(candidate){
  var statenames = {
    "ကချင်ပြည်နယ်": "Kachin",
    "ကယားပြည်နယ်": "Kayah",
    "ကရင်ပြည်နယ်": "Kayin",
    "ချင်းပြည်နယ်": "Chin",
    "စစ်ကိုင်းတိုင်းဒေသကြီး": "Sagaing",
    "တနင်္သာရီတိုင်းဒေသကြီး": "Tanintharyi",
    "ပဲခူးတိုင်းဒေသကြီး": "Bago",
    "မကွေးတိုင်းဒေသကြီး": "Magway",
    "မန္တလေးတိုင်းဒေသကြီး": "Mandalay",
    "မွန်ပြည်နယ်": "Mon",
    "ရခိုင်ပြည်နယ်": "Rakhine",
    "ရန်ကုန်တိုင်းဒေသကြီး": "Yangon",
    "ရှမ်းပြည်နယ်": "Shan",
    "ဧရာဝတီတိုင်းဒေသကြီး": "Ayeyarwady",
    "ဧရာဝတီတိုင်း���ေသကြီး": "Ayeyarwady",
    "ပြည်တောင်စုနယ်မြေ": "Federal",
    "ကချင်": "Kachin",
    "ကယား": "Kayah",
    "ကရင်": "Kayin",
    "ချင်း": "Chin",
    "စစ်ကိုင်း": "Sagaing",
    "တနင်္သာရီ": "Tanintharyi",
    "ပဲခူး": "Bago",
    "မကွေး": "Magway",
    "မန္တလေး": "Mandalay",
    "မွန်": "Mon",
    "ရခိုင်": "Rakhine",
    "ရန်ကုန်": "Yangon",
    "ရှမ်း": "Shan",
    "ဧရာဝတီ": "Ayeyarwady"
  };

  return statenames[candidate.constituency.parent];
};

// insert old code for temp usage

const LEGISLATURES = {
  lower_house: "ပြည်သူ့လွှတ်တော်",
  upper_house: "အမျိုးသားလွှတ်တော်",
  regional_house: "တိုင်းဒေသကြီး/ပြည်နယ် လွှတ်တော်"
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
        candidatesCount: -1
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
