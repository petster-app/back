'use strict';

const express = require('express');
const router = express.Router();
const handleError = require('../middleware/error');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL)
client.connect();

router.get('/details/:petfinderid', getDetails);

function getDetails(request, response) {

  let SQL = `SELECT * FROM pets WHERE petfinderid = '${request.params.petfinderid}';`;
 
  return client.query(SQL)
    .then(results => {
      response.send(results.rows[0])
    })
    .catch(err => handleError(err, response));
}

module.exports = router;