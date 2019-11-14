'use strict';

const express = require('express');
const router = express.Router();
const handleError = require('../middleware/error');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL)
client.connect();

router.get('/temp-pets', getTempPets);
router.post('/temp-pets', postTempPets);

function getTempPets(request, response) {

  let SQL = `SELECT * FROM temp_pets`;
 
  return client.query(SQL)
    .then(results => {
      response.send(results.rows)
    })
    .catch(err => handleError(err, response));
}

function postTempPets(request, response) {

  let SQL = '';

  request.body[0].map((animal, index) => {
  
    let { type, name, age, gender, size, city, state, description, photo, url } = animal;
    //console.log(animal.name,index);
    
    SQL = SQL + `INSERT INTO temp_pets (petfinderid, type, name, age, gender, size, city, state, description, photo, url) VALUES ('1111111','${type}','${name}', '${age}', '${gender}', '${size}','${city}', '${state}', '${description}', '${photo}', '${url}')
    ;`
  })

  console.log(SQL)

  return client.query(SQL)
    .then(sqlResults => {
      console.log('hellohello');
      response.send(sqlResults);
    })
    .catch(error => handleError(error, response));
}

module.exports = router;