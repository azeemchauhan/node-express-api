# NODE / EXPRESS API 💫

Build REST API using Node.js/Express/Typescript

Tech Stack: 
 - [Node](https://nodejs.org/en/)/Express
 - TypeScript
 - Sequalize (ORM)
 - supertest (End to End tests)


### Initial Setup

```sh
npm i
npm run build
npm run seed
```

`npm run seed`seed the local SQLite database  **Warning: This will drop the database if it exists**.

### Running app locally
Create `.env` file from `.env.sample`

> The server is running with [nodemon](https://nodemon.io/), which will automatically restart whenever you modify and save a file.

```sh
npm run start
```


### Running Test locally
```sh
npm run test
```


### Running Test E2E Tests locally
```sh
npm run start # First you must start the API Server
npm run test
```

## Code Coverage
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------|---------|----------|---------|---------|-------------------
All files            |   75.87 |    55.55 |   61.66 |   80.42 |                   
 src                 |   96.29 |      100 |      50 |   96.29 |                   
  app.ts             |     100 |      100 |     100 |     100 |                   
  server.ts          |    92.3 |      100 |      50 |    92.3 | 16                
 src/config          |     100 |      100 |     100 |     100 |                   
  cache.ts           |     100 |      100 |     100 |     100 |                   
  database.ts        |     100 |      100 |     100 |     100 |                   
 src/controllers     |   39.09 |        0 |   29.03 |   45.28 |                   
  admin.ts           |   33.33 |        0 |       0 |   36.84 | 11-44,55-90       
  contract.ts        |   30.43 |        0 |       0 |   33.33 | 15-35,40-60       
  index.ts           |     100 |      100 |     100 |     100 |                   
  job.ts             |   34.78 |        0 |       0 |   38.88 | 14-37,50-74       
  payment.ts         |   28.57 |        0 |       0 |    37.5 | 13-44             
  profile.ts         |   32.14 |        0 |       0 |   38.09 | 14-26,30-54       
 src/middlewares     |     100 |    93.33 |     100 |     100 |                   
  addUserProfile.ts  |     100 |      100 |     100 |     100 |                   
  errorHandler.ts    |     100 |     87.5 |     100 |     100 | 10                
 src/models          |     100 |      100 |     100 |     100 |                   
  index.ts           |     100 |      100 |     100 |     100 |                   
 src/models/contract |     100 |      100 |     100 |     100 |                   
  index.ts           |     100 |      100 |     100 |     100 |                   
 src/models/job      |     100 |      100 |     100 |     100 |                   
  index.ts           |     100 |      100 |     100 |     100 |                   
 src/models/profile  |     100 |      100 |     100 |     100 |                   
  index.ts           |     100 |      100 |     100 |     100 |                   
 src/routes          |     100 |      100 |     100 |     100 |                   
  index.ts           |     100 |      100 |     100 |     100 |                   
 src/routes/admin    |     100 |      100 |     100 |     100 |                   
  index.ts           |     100 |      100 |     100 |     100 |                   
 src/routes/contract |     100 |      100 |     100 |     100 |                   
  index.ts           |     100 |      100 |     100 |     100 |                   
 src/routes/job      |   81.25 |    56.25 |     100 |   85.71 |                   
  index.ts           |   81.25 |    56.25 |     100 |   85.71 | 51-55             
 src/routes/payment  |   90.47 |       40 |     100 |   94.73 |                   
  index.ts           |   90.47 |       40 |     100 |   94.73 | 32                
 src/utils           |     100 |      100 |     100 |     100 |                   
  appError.ts        |     100 |      100 |     100 |     100 |                   
  guards.ts          |     100 |      100 |     100 |     100 |                   
  logger.ts          |     100 |      100 |     100 |     100 |                   
  validations.ts     |     100 |      100 |     100 |     100 |                   
---------------------|---------|----------|---------|---------|-------------------

Test Suites: 12 passed, 12 total
Tests:       37 passed, 37 total


## Cetralised Logging
When application runs it will create logs in `application.logs`
