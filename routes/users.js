const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../passport');

const Models = require('../models.js');
mongoose = require('mongoose');

const Users = Models.User;

// import express-validator 
const {check, validationResult} = require('express-validator');

/**
 * POST request to the /users endpoint to create a new user data. This request requires a request 
 * body containing the fields: Username, Password, Email, Birthday. The fields are first validated 
 * against specified validators before the new user record is created.
 * @method POST 
 * @param {string} URL
 * @param {object} validationChain Series of checks that validate specified fields in the request body.
 * @param {requestCallback}
 * @returns {Object} An object containing the new user record.
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
      // (422) - unprocessable Entity
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


/**
 * PUT request to the /users/[Username] endpoint to update the user's details. This request requires 
 * a request body containing the fields: Username, Password, Email, Birthday. The fields are first 
 * validated against specified validators before the user record is updated.
 * @method PUT
 * @param {string} URL
 * @example /users/myusername
 * @param {object} validationChain Series of checks that validate specified fields in the request body.
 * @param {authenticationCallback}
 * @param {requestCallback}
 * @returns {Object} An object containing the updated user record.
 */
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

/**
 * PUT request to the /users/[Username]/[MovieID] endpoint. To add a movie into user favourite list.
 * @method PUT 
 * @param {string} URL
 * @example /users/myusername/12345678
 * @param {authenticationCallback} 
 * @param {requestCallback}
 * @returns {Object} An array with the user's updated favourite movies. The mongoose populate method 
 * is used to replace the ID of each movie with the document from the movies collection.
 */
router.put('/:Username/:MovieId',  passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavMovies: req.params.MovieId }
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

/**
 * PUT request to the /users/[Username]/[MovieID] endpoint.To remove a movie from user favourite list.
 * @method PUT 
 * @param {string} URL
 * @example /users/myusername/60a110a28e923350a5340b06
 * @param {authenticationCallback} 
 * @param {requestCallback}
 * @returns {Object} An array with the user's updated favourite movies. The mongoose populate method 
 * is used to replace the ID of each movie with the document from the movies collection.
 */
router.put('/:Username/FavMovies/:MovieID',  passport.authenticate('jwt', { session: false }), (req, res) => {
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


/**
 * GET request to the /users/[Username]/user endpoint. To get a user by name
 * @method GET 
 * @param {string} URL
 * @example /users/myusername
 * @param {authenticationCallback} 
 * @param {requestCallback}
 * @returns {Object} An object containing the record for the user included in the URL.
 */
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
/**
 * DELETE request to the /users/[Username] endpoint. To remove a user account.
 * @method DELETE
 * @param {string} URL
 * @example /users/myusername
 * @param {authenticationCallback} 
 * @param {requestCallback}
 * @returns {string} A text message: '[Username] has been removed'.
 */
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