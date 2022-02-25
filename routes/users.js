const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../passport');

const Models = require('../models.js');
mongoose = require('mongoose');
//if( !mongoose.Types.ObjectId.isValid(id) ) return false;


// const Movies = Models.Movie;
// const Directors = Models.Director;
// const Genres = Models.Genre;
const Users = Models.User;


// import express-validator 
const {check, validationResult} = require('express-validator');


/**
 * Add a new user to the database
 * @return A JSON object with a status lines of code about the submission
 */
router.post('/', [
    check('Username', 'Username is required').isLength({min: 3}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

   // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      // (422)- unprocessable Entity
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = Users.hashedPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exist')
      } 
      else { 
        Users.create({
    Username: req.body.Username,
    Password: hashedPassword,//req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday 
        }) .then((user) => {res.status(201).json(user)})
      }
    })
})

//*********************Request update for a user info
router.put('/:Username',  [
    check('Username', 'Username is required').isLength({min: 3}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser); (res.status(201).send('success!'))
    }
  });
});



//****************Request for a user to add movie to thier fav-movies list 
router.put('/:Username/:MovieID',  passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavMovies: req.params.MovieID }
    },
    { new: true }, 
  (err, updateUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updateUser);
    }
  });
});

//********************Request for a user to remove a movie from their fav-movie list 
router.delete('/:Username/FavMovies/:MovieID',  passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
      $pull: { FavMovies: req.params.MovieID }
    },
    { new: true }, 
  (err, updateUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updateUser);
    }
  });
});

//******************Test route, to get a user by name
router.get('/:Username/user', passport.authenticate('jwt', { session: false }), (req,res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

//**********************Request for a user to remove their account from the app
router.delete('/:Username', [
    check('Username', 'Username is required').isLength({min: 3}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(201).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



module.exports = router;