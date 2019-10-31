'use strict';

// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

// Environment variables
require('dotenv').config();

// Routers
const searchRouter = require('./routes/search-router');

// Database set up
const client = new pg.Client(process.env.DATABASE_URL)
client.connect();
client.query(`SELECT * FROM favorites`)
  .catch(() => client.query(`CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    petfinderid VARCHAR(255),
    type VARCHAR(255),
    name VARCHAR(255),
    age VARCHAR(255),
    gender VARCHAR(255),
    size VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    description TEXT,
    photo VARCHAR(255),
    url TEXT
  );`))
client.on('err', err => console.error(err));

// Application Setup
const app = express();
const PORT = process.env.PORT;
console.log(PORT)

// Application Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Method overide
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

// API Routes:

app.use(searchRouter);
// app.get('/details', renderDetailsPageFromFav);
// app.get('/aboutUs', renderAboutUsPage);
// app.post('/favorites', saveFavorite);
// app.get('/favorites/:userName', renderSavedPets);
// app.delete('/favorites', deleteFavorite);

// // Helper Functions:

// // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript


// function renderDetailsPageFromFav(request, response) {

//   let SQL = `SELECT * FROM pets WHERE petfinderid = '${request.query.petfinderid}';`;
 
//   console.log('params', request.query);
//   return client.query(SQL)
//     .then(results => {
//       // console.log(results);
//       response.render('pages/details', {petDetailsResponse: results.rows[0], userName:request.query.userName})
//     })
//     .catch(err => handleError(err, response));
// }


// function addUserName (queryName) {


//   const SQL = `
//   INSERT INTO users (username) SELECT '${queryName}' 
//   WHERE NOT EXISTS (SELECT * FROM users WHERE username = '${queryName}');
//   `;

//   return client.query(SQL)
//     .catch(error => handleError(error, response));
// }


// function saveFavorite(request, response){

//   let { petfinderid, userName, type, name, age, gender, size, city, state, description, photo, url } = request.body;


//   const SQL = `
//   INSERT INTO pets (petfinderid, type, name, age, gender, size, city, state, description, photo, url) SELECT '${petfinderid}','${type}','${name}', '${age}', '${gender}', '${size}','${city}', '${state}', '${description}', '${photo}', '${url}' 
//   WHERE NOT EXISTS (SELECT * FROM favorites WHERE petfinderid = '${petfinderid}');

//   INSERT INTO favorite_pets (pet_id, username_id) VALUES ('${petfinderid}',(SELECT id FROM users WHERE username='${userName}'));

//   `;

//   return client.query(SQL)
//     .then(sqlResults => { //console.log('hello')
//       response.redirect(`/search`)
//     })
//     .catch(error => handleError(error, response));
// }

// function renderSavedPets(request, response) {

//   let userName = request.params.userName;

//   let SQL = `
//     SELECT * FROM pets
//     INNER JOIN favorite_pets
//     ON petfinderid=pet_id
//     INNER JOIN users
//     ON users.id=username_id
//     WHERE username='${userName}';
//   `;


//   return client.query(SQL)
//     .then(results => {
//       response.render('pages/favorites', {renderFavorites: results.rows, userName: userName})
//     })
//     .catch(error => handleError(error, response));
// }


// function deleteFavorite(request, response) {

//   let userName = request.body.userName;

//   let petfinderid = request.body.petfinderid;
 
//   let SQL = `DELETE FROM favorite_pets WHERE pet_id='${petfinderid}';
//     SELECT * FROM pets
//     INNER JOIN favorite_pets
//     ON petfinderid=pet_id
//     INNER JOIN users
//     ON users.id=username_id
//     WHERE username='${userName}';
//   `;

  

//   return client.query(SQL)
//     .then(results => {
//       response.render('pages/favorites', {renderFavorites: results[1].rows, userName: userName})
//     })
//     .catch(err => handleError(err, response));


// }


// function renderAboutUsPage(request, response) {
//   response.render('pages/aboutUs');
// }

// // Error Handling Function
// function handleError(error, response) {
//   console.error(error);
//   response.status(500).send('Sorry, something went wrong')
// }




// Button Event Handler

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
