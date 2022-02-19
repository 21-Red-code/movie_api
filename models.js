const mongoose = require('mongoose');
stringify  = require('uuid');

const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre:{
    Name: String,
    Description: {type: String}
  },
  Director: {
    Name: String,
    Bio: String,
    Birthday: Date,
    Death: {type: String}
  }
  // Actors: [String],
  // ImagePath: String,
  // Featured: Boolean
});

let genreSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Bio: { type: String,},
  Birthday: Date,
    Death: {type: String}
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//does the actual hashing of submitted passwords
userSchema.statics.hashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

//compares submitted hashed pws with already hashed & stored pws in the db
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);
let User = mongoose.model('User', userSchema);

module.exports = { Movie, Director, Genre, User }

