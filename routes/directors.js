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
//  const { route } = require('./movies');



//**************Get more info about a director by name 
router.get('/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({Name: req.params.Name })
      .then((directors) => {
        res.status(200).json(directors)
      })
      .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err)
    });
});

module.exports = router; 