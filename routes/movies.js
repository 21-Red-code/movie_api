const express = require('express');

const router = express.Router();
const passport = require('passport');
require('../passport');

const Models = require('../models.js');
const mongoose = require('mongoose');

const Movies = Models.Movie;
const Directors = Models.Director;
const Genres = Models.Genre;
const Users = Models.User;

// import express-validator 
const {check, validationResult} = require('express-validator');


/**
 * GET request to the /movies endpoint.
 * @method GET
 * @param {string} URL
 * @param {authenticationCallback} 
 * @param {requestCallback}
 * @returns {Object} An array of all the movie records in the database.
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err)
    });
}); 

/**
 * GET request to the /movies/[Title] endpoint.
 * @method GET
 * @param {string} URL
 * @example /movies/The Godfather
 * @param {authenticationCallback} 
 * @param {requestCallback}
 * @returns {Object} An object containing the movie record for the movie whose title is included in the URL. 
 */
router.get('/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err)
    });
});


module.exports = router; 