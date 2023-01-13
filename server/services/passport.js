const passport = require('passport');
const User = require('../models/user');
const keys = require('../config/keys');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');

//define local log in strategy
const localOptions = {
  usernameField: 'userName',
  passwordField: 'password'
}
const localLogin = new LocalStrategy(localOptions,
  function(userName, password, done){
    User.findOne({userName: userName}, function(err, user){
      if(err) {return done(err);}
      if(!user) { return done(null, false)}
      if(!user.validPassword(password)){
        return done(null, false, { message: 'Wrong Password!'})
      }
      return done(null, user);
    });
  }
);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.TOKEN_SECRET
};
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  });
});


// mount local strategy to passport
passport.use(localLogin);
passport.use(jwtLogin);