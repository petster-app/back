"use strict";

const express = require("express");
const router = express.Router();
const handleError = require("../middleware/error");
const pg = require("pg");

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

router.get("/users/:email", getUser);
router.post("/users", postUser);
router.patch("/users", updateUser);

function updateUser(request, response) {
  let SQL = `UPDATE users SET zipcode = ${request.body.zipCode} WHERE  username = '${request.body.userName}'; SELECT * FROM users WHERE username = '${request.body.userName}';`;

  // `UPDATE users SET zipcode = 98103 WHERE  username = 'testingsql'; SELECT * FROM users WHERE username = 'testingsql';`;

  return client
    .query(SQL)
    .then((results) => {
      response.send(results[1].rows);
    })
    .catch((err) => console.log(err));
}

function getUser(request, response) {
  let email = request.params.email;
  let SQL = `SELECT * FROM users WHERE username = '${email}';`;

  return client
    .query(SQL)
    .then((results) => {
      response.send(results.rows);
    })
    .catch((err) => console.log(err));
}

function postUser(request, response) {
  let SQL = `INSERT INTO users (username, zipCode) SELECT '${request.body.userName}', ${request.body.zipCode} 
  WHERE NOT EXISTS (SELECT * FROM users WHERE username = '${request.body.userName}'); SELECT * FROM users WHERE username = '${request.body.userName}';`;

  // INSERT INTO users (username, zipCode) SELECT 'sqltest', 98103
  // WHERE NOT EXISTS (SELECT * FROM users WHERE username = 'sqltest'); SELECT * FROM users WHERE username = 'sqltest';

  console.log(SQL);
  return client
    .query(SQL)
    .then((results) => {
      console.log(results, "results");
      response.send(results[1].rows);
    })
    .catch((err) => console.log("err"));
}

module.exports = router;
