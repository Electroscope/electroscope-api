Electroscope API
================

## Endpoints ###

### Candidate Count ###

* By Gender [return M or F count for each party or parliament]
**  url => http://localhost:3000/api/candidates/count/by-gender?year=2015&group_by=parliment

```
  Params
  ------
  group_by => either 'party' or 'parliament'
  year => only support 2015 right now
  party => show only for party
  	   [grep 'code' mongo/parties.json]
  constituency => show only for constituency
  	       [grep 'constituency' mongo/candidate_records*.json]
  parliament => show only for parliament
  	     	[grep 'code' mongo/parliaments.json]
```


* By Party [return candidate count for each party for each parliment]
**  url => http://localhost:3000/api/candidates/count/by-party?year=2015&party=NLFD&paliament=PTH

```
  Params
  ------
  year => 2010 or 2015
  party => show only for party
  constituency => show only for constituency
  parliament => show only for parliament
```

* By Ethnicity [return (candidate) ethnicity count for each parliment or party]
**  url => http://localhost:3000/api/candidates/count/by-ethnicity?group_by=party
```
  group_by => either 'party' or 'parliament'
  year => only support 2015 right now
  party => show only for party
  constituency => show only for constituency
  parliament => show only for parliament
```

* General Purpose
**  url =>  http://localhost:3000/api/candidates/count?year=2015&group_by=party,parliament_code

```
  Params
  ------
  year => 2010 or 2015
  party => show only for party
  constituency => shor only for constituency
  parliament => show only for parliament
  group_by => party and/or parliament_code and/or constituency
	      technially any field in `candidate_records`
```

## Pre-require ##

- nodejs
- mongoDB

## Developement Run ##

```bash
npm install
npm start
```

## Test ##

```bash
npm test
```