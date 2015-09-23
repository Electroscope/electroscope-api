Electroscope API
================
## Endpoints ###


### By Gender ###
* return M or F count for each party or parliament
*  url => http://localhost:3000/api/candidates/count/by-gender?year=2015&group_by=parliment

```
  Params
  ------
  group_by => either 'party' or 'parliament'  or state
  year => only support 2015 right now
  party => show only for party
  	   [grep 'code' mongo/parties.json]
  constituency => show only for constituency
  	       [grep 'constituency' mongo/candidate_records*.json]
  parliament => show only for parliament
  	     	[grep 'code' mongo/parliaments.json]
  state => show only for state
```

### By Party ###
* return candidate count for each party
*  url => http://localhost:3000/api/candidates/count/by-party?year=2015&party=NLFD&parliament=PTH

```
  Params
  ------
  year => 2010 or 2015
  group_by => either 'state' or 'parliament'
  party => show only for party
  parliament => show only for parliament
  state => show only for state
```

### By Parliament ###
* return candidate count for each parliament
*  url => http://localhost:3000/api/candidates/count/by-parliament?group_by=party

```
  Params
  ------
  year => 2010 or 2015
  group_by => either 'state' or 'party'
  party => show only for party
  parliament => show only for parliament
  state => show only for state
```

### By State ###
* return candidate count for each party in each state
*  url => http://localhost:3000/api/candidates/count/by-state?state=Chin

```
  Params
  ------
  year => 2010 or 2015
  group_by => either 'party' or 'parliament'
  state => show only for state
  parliament => show only for parliament
  state => show only for state
```

### By Ethnicity ###
* return (candidate) ethnicity count for each parliment or party
*  url => http://localhost:3000/api/candidates/count/by-ethnicity?group_by=party

```
  Params
  ------
  group_by => either 'party' or 'parliament' or state
  year => only support 2015 right now
  party => show only for party
  constituency => show only for constituency
  parliament => show only for parliament
```

### By Religion ###
* return candidate count by religion for each parliment or party
*  url => http://localhost:3000/api/candidates/count/by-religion?party=NLFD

```
  Params
  ------
  group_by => either 'party' or 'parliament' or state
  year => only support 2015 right now
  party => show only for party
  constituency => show only for constituency
  parliament => show only for parliament
  state => show only for state
```

### By Agegroup ###
* return (candidate) agegroup ranges for each parliment or party
*  url => http://localhost:3000/api/candidates/count/by-agegroup?year=2015&group_by=party

```
  Params
  ------
  group_by => either 'party' or 'parliament' or state
  year => only support 2015 right now
  party => show only for party
  constituency => show only for constituency
  parliament => show only for parliament
  state => show only for state
```

### General Purpose ###
*  url =>  http://localhost:3000/api/candidates/count?year=2015&group_by=party,parliament_code

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