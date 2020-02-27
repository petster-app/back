'use strict';

const express = require('express');
const router = express.Router();
const handleError = require('../middleware/error');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL)
client.connect();

router.post('/users', postUser);

function postUser(request, response) {

  let SQL = `INSERT INTO users (username) SELECT '${request.body.userName}'  
  WHERE NOT EXISTS (SELECT * FROM users WHERE username = '${request.body.userName}');`;
 
  return client.query(SQL)
    .then(results => {
      response.send(results.rows)
    })
    .catch(err => handleError(err, response));
}


module.exports = router;