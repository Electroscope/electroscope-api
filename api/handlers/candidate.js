var CandidateModel = $.rootRequire("api/models/candidate");
var Handler = $.rootRequire("api/handlers");
var MaePaySohAPI = $.rootRequire("libs/apis/maepaysoh.js");

var CandidateHandler = new Handler(CandidateModel);

CandidateHandler.syncWithMaePaySoh = function () {
  var handler = this;
  return new Promise(function (resolve, reject) {
    MaePaySohAPI.candidate.getAll(function (candidates) {
      console.log(candidates.length + " candidates are got!!");
    }).then(function (candidates) {

      handler.create({
        data: candidates
      })
      .then(function () {
        console.log(candidates.length 
            + " candidates had been saved");
        resolve(candidates);
      }).catch(reject);

    }).catch(reject);
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
      $match.legislature = query.legislature; 

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

module.exports = CandidateHandler;
