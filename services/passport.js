const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

// serialize user 
passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

// deserialize user
passport.deserializeUser((id, done) => {
  console.log(id);
  User.findById(id)
    .then(user => done(null, user));
})

// config for the google strategy when authentication using google
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, 
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
      .then(existingUser => {
        if(existingUser) {
          // user already exits
          done(null, existingUser);
        } else {
          console.log(profile);
          new User({
            googleId: profile.id
          }).save()
            .then(user => done(null, user))
        }
      })
    
  }
));