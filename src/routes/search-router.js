"use strict";

const express = require("express");
const router = express.Router();
const superagent = require("superagent");
const getToken = require("../middleware/getToken");
const handleError = require("../middleware/error");

router.get(
  "/search/:type/:city/:travelDistance/:timeBefore/:limit",
  getToken,
  getPetfinderData
);

function getPetfinderData(request, response, next) {
  let queryType = request.params.type;
  let queryZipCode = request.params.city;
  let queryDistance = request.params.travelDistance;
  let queryTimeBefore = request.params.timeBefore;
  let queryLimit = request.params.limit;
  console.log(request.params)
  let URL =
    queryTimeBefore == null
      ? `https://api.petfinder.com/v2/animals?type=${queryType}&location=${queryZipCode}&distance=${queryDistance}&limit=100&status=adoptable&before=${queryTimeBefore}&limit=${queryLimit}`
      : `https://api.petfinder.com/v2/animals?type=${queryType}&location=${queryZipCode}&distance=${queryDistance}&status=adoptable&limit=${queryLimit}`;

  return superagent
    .get(URL)
    .set("Authorization", `Bearer ${request.token}`)
    .then(apiResponse => {
      const petInstances = apiResponse.body.animals.map(pet => new Pet(pet));
      response.send([petInstances]);
      next();
    })
    .catch(error => console.log(error));
}

function Pet(query) {
  // console.log(query);
  this.type = query.type;
  this.petfinderid = query.id;
  this.name = cleanName(query.name);
  this.age = query.age;
  this.gender = query.gender;
  this.size = query.size;
  this.color = query.colors.primary;
  this.spayedNeutered = query.attributes.spayed_neutered;
  this.shotsCurrent = query.attributes.shots_current;
  this.houseTrained = query.attributes.house_trained;
  this.goodWithKids = query.environment.children;
  this.goodWithDogs = query.environment.dogs;
  this.city = query.contact.address.city;
  this.state = query.contact.address.state;
  this.description = query.description
    ? cleanDescription(query.description)
    : null;
  this.type = query.type;
  this.url = query.url;
  this.primaryBreed = query.breeds.primary;
  this.secondaryBreed = query.breeds.secondary;
  this.photo = query.photos
    ? query.photos[0]
      ? query.photos[0].medium
      : undefined
    : undefined;
  this.published_at = query.published_at;
  this.inFavs = false;
}

function cleanName(name) {
  let modifiedName;
  const splitName = name.split(" ");
  if (
    splitName[1] &&
    splitName[1].charAt(0).toUpperCase() != splitName[1].charAt(0).toLowerCase()
  ) {
    modifiedName = `${splitName[0]} ${splitName[1]}`;
  } else {
    modifiedName = splitName[0];
  }
  console.log(name, modifiedName);
  return modifiedName;
}

function cleanDescription(description) {
  return description
    .replace(/(& #39|& #39;|&#039;|&#39;)/gm, "'")
    .replace(/(&quot;|& quot;)/gm, '"')
    .replace(/&amp;/gm, " & ")
    .replace(/#10;/gm, "")
    .replace(/& quot/gm, "")
    .replace(/\n/gm, " ");
}

module.exports = router;
