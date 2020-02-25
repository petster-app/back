'use strict';

const express = require('express');
const pg = require('pg');
const router = express.Router();
const handleError = require('../middleware/error');

const client = new pg.Client(process.env.DATABASE_URL)
client.connect();

router.post('/favorites', postFavorite);
router.get('/favorites', getAllFavoritePets);
router.get('/favorites/:userName', getFavoritePets);
router.delete('/favorites', deleteFavorite);

function postFavorite(request, response){
  let { petfinderid, userName, type, name, age, gender, size, city, state, description, photo, url } = request.body;
  const SQL = `
  INSERT INTO favorited_pets (petfinderid, type, name, age, gender, size, city, state, description, photo, url) SELECT '${petfinderid}','${type}','${name}', '${age}', '${gender}', '${size}','${city}', '${state}', '${description}', '${photo}', '${url}' 
  WHERE NOT EXISTS (SELECT * FROM favorited_pets WHERE petfinderid = '${petfinderid}');
  INSERT INTO user_pets (pet_id, username_id) SELECT '${petfinderid}',(SELECT id FROM users WHERE username='${userName}')
  WHERE NOT EXISTS (SELECT * FROM user_pets WHERE pet_id = '${petfinderid}' AND username_id=(SELECT id FROM users WHERE username='${userName}'));
  `;
  return client.query(SQL)
    .then(response.send(request.body))
    .catch(error => handleError(error, response));
}


function getAllFavoritePets(request, response) {

  let userName = request.params.userName;
  let SQL = `
    SELECT * FROM favorited_pets;
  `;

  return client.query(SQL)
    .then(sqlResults => {
      response.send(sqlResults.rows);
    })
    .catch(error => handleError(error, response));
}

function getFavoritePets(request, response) {

  let userName = request.params.userName;

  let SQL = `
    SELECT * FROM favorited_pets
    INNER JOIN user_pets
    ON petfinderid=pet_id
    INNER JOIN users
    ON users.id=username_id
    WHERE username='${userName}';
  `;

  return client.query(SQL)
    .then(sqlResults => {
      response.send(sqlResults.rows);
    })
    .catch(error => handleError(error, response));
}


function deleteFavorite(request, response) {

  const userName = request.body.userName;
  const petfinderid = request.body.petfinderid;
 
  const SQL = `DELETE FROM user_pets WHERE pet_id='${petfinderid}' AND username_id=(SELECT id FROM users WHERE username='${userName}');`
  return client.query(SQL)
  .then(sqlResults => {
    response.send(sqlResults.rows);
  })
.catch(err => handleError(err, response));
}

module.exports = router;