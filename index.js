const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//(app) argument makes express to be available in auth.js as well
let auth = require('./auth')(app);

//Import Routes
const moviesRoute = require('./routes/movies');
const usersRoute = require('./routes/users');
const directorsRoute = require('./routes/directors');
const genresRoute = require('./routes/genres');

const passport = require('passport');
require('./passport');

app.use(passport.initialize());

const Models = require('./models.js');
const mongoose = require('mongoose');
require('dotenv/config');

// to connect to local DB
//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//  for connecting with MongoDB Atlas 
// mongoose.connect(
//   process.env.classic_movies, 
//   { useNewUrlParser: true, 
//     useUnifiedTopology: true 
//   }
// ); 

//to push any changes to Heroku
// mongoose.connect(
//   process.env.ClassicMovies_URI, 
//   { useNewUrlParser: true, 
//     useUnifiedTopology: true 
//   }
// ); 

const Movies = Models.Movie;
const Directors = Models.Director;
const Genres = Models.Genre;
const Users = Models.User;

app.use(express.json())

// import express-validator 
const {check, validationResult} = require('express-validator');
const { response } = require('express');

//***** Routes
  //route to root directory
app.get('/', (req, res) => {
  res.send('Welcome to Classic Movies collection!')
})

// route to documentation page
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname});
});

app.use('/movies', moviesRoute);

app.use('/users', usersRoute);

app.use('/directors', directorsRoute);

app.use('/genres', genresRoute);


// Error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('something went wrong');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0',() => {
  console.log('Listening on Port ' + PORT);
});





