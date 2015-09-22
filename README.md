Electroscope API
================

## Endpoints ##

* http://localhost:3000/api/parties/candidate-count?year=2010 (particpating candidate group by parliaments for all parties)
```
  *Params*
  `year` => 2010 or 2015
```

* http://localhost:3000/api/parties/:party-code/candidate-count (particpating candidate group by parliaments for all parties)
````
  *Params*
  `year` => 2010 or 2015
  `party-code` => grep 'code' mongo/parties.json  (for example NLFD for NLD)
```


* http://localhost:3000/api/parties/:party-code/gender-count (male female counts for each parties)
```
  *Params*
  `year` => only 2010
  `party-code` => grep 'code' mongo/parties.json  (for example NLFD for NLD)
```

* http://localhost:3000/api/candidate-count?year=2015&group_by=party,parliament_code (genderal allpurpose candidate-count, not recommended to use, will all wrapper)
```
  *Params*
  `year` => 2010 or 2015
  `party` => party code (grep 'code' mongo/parties.json)
  `constituency` => constituency code (grep constituency mongo/candidate_records_201?.json)
  `parliament` => parliament code (grep parliment_code mongo/candidate_records_201?.json)
  `group_by` => party and/or parliament_code and/or constituency
		technially any field in `candidate_records`

  http://localhost:3000/api/candidate-count?year=2015&group_by=candidate.gender,parliament_code
```

## Pre-require

- nodejs
- mongoDB

## Developement Run

```bash
npm install
npm start
```

## Test

```bash
npm test
```