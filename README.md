Election API
============

The most incredible Myanmar election data center power by apalar peoples.

### Pre-require

- nodejs
- mongoDB

### Developement Run

```bash
npm install
npm start
```

### Test

```bash
npm test
```

### Structure

- All Application business rules are in `api` folder and 
they should seperate to web delivery mechanism
- Controllers are construct on Express Router and
it export web delivery system, connect between applicaiton's
handlers
- I just like make test for business rules only
