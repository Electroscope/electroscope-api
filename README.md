Electroscope API
================

The most incredible Myanmar election data center power by apalar peoples.

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

## Structure

- All Application business rules are in `api` folder and 
they should seperate to web delivery mechanism
- Controllers are construct on Express Router and
it export web delivery system, connect between applicaiton's
handlers
- I just like make test for business rules only

## Basic API end-points system

The end-point system is base on *REST API* model.  
The allowence `Content-Type` are `x-www-form-urlencoded` and `application/json`.  
Current API don't have any Authonication.

### Create an item
`POST: [host]/api/[collection-name]`

*BODY*
```
{
  "name": "U Aung Aung",
  "age": 38,
  "party_id": 10001,
}
```

for multi create request, send an Array or items.

```
[
  {
    "name": "U Aung Aung",
    "age": 38,
    "party_id": 10001,
  },{
    "name": "U Aung Aung",
    "age": 38,
    "party_id": 10001,
  }
]
```

*RESULT MODEL*

The result will be created object[s]

### Get List of items
`GET: [host]/api/[collection-name]`

*RESULT MODEL*

```
{
  "data": [{item-1}, {item-2}]
}
```

TODO: We have no pagin currently

### Get item detail
`GET: [host]/api/[collection-name]/[item-id]`

*RESULT MODEL*

```
{
  "data": {item-data}
}
```

### Search item
`GET: [host]/api/[collection-name]?[query]`

*QUERY*

`?name=Aung%20Aung`

*RESULT MODEL*

This will be same as *list request*

### Update item
`PUT: [host]/api/[collection-name]/[item-id]`

*BODY*
```
{
  "name": "U Aung Aung",
  "age": 38,
  "party_id": 10001,
}
```

Unlike *Create Request* update don't support multipal update


*RESULT MODEL*

The result will be updated object[s]

### Delete item
`DELETE: [host]/api/[collection-name]/[item-id]`

*SUCCESS RESULT*

`{ "success": true }`

