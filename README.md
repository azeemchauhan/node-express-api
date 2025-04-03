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

## Cetralised Logging
When application runs it will create logs in `application.logs`
