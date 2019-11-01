'use strict';

const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const getToken = require('../middleware/getToken');
const handleError = require('../middleware/error');

router.get('/search', getToken, getPetfinderData);

function getPetfinderData(request, response, next) {

  let queryType = request.body.type;
  let queryZipCode = request.body.city;
  let queryDistance = request.body.travelDistance;
  let URL = `https://api.petfinder.com/v2/animals?type=${queryType}&location=${queryZipCode}&distance=${queryDistance}&limit=100&sort=random&status=adoptable`

  return superagent.get(URL)
    .set('Authorization', `Bearer ${request.token}`)
    .then(apiResponse => {
      const petInstances = apiResponse.body.animals.map(pet => new Pet (pet))
      response.send([petInstances])
      next();
    })
    .catch(error => handleError(error));
}

function Pet(query) {
  this.type = query.type;
  this.petfinderid = query.id;
  this.name = query.name;
  this.age = query.age;
  this.gender = query.gender;
  this.size = query.size;
  this.city = query.contact.address.city;
  this.state = query.contact.address.state;
  this.description = query.description ? cleanDescription(query.description) : null;
  this.type = query.type;
  this.url = query.url;
  this.primaryBreed = query.breeds.primary;
  this.secondaryBreed = query.breeds.secondary;
  this.photos = [];
  this.inFavs = false;
}

function cleanDescription(description) {
 return description
 .replace(/(& #39|& #39;|&#039;|&#39;)/gm, '\'')
 .replace(/(&quot;|& quot;)/gm, '"')
 .replace(/&amp;/gm, ' & ')
 .replace(/#10;/gm, '')
 .replace(/& quot/gm, '')
 .replace(/\n/gm, ' ')
}

module.exports = router;