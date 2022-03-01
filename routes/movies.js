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



//*******************Get a list of movies 

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

//******************************Find movie by title
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

//** ** **


module.exports = router; 