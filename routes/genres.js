const express = require('express');

const router = express.Router();
const passport = require('passport');
require('../passport');

const Models = require('../models.js');
mongoose = require('mongoose');

const Movies = Models.Movie;
const Directors = Models.Director;
const Genres = Models.Genre;
const Users = Models.User;


// import express-validator 
const {check, validationResult} = require('express-validator');


//**************Get more info about a genre by name 
router.get('/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genres.findOne({Name: req.params.Name })
      .then((genres) => {
        res.status(200).json(genres)
      })
      .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err)
    });
});

module.exports = router;