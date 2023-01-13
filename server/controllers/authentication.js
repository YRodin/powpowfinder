const jwt = require('jwt-simple')
const User = require('../models/user')
const keys = require('../config/dev')

function tokenForUser(user) {
  return jwt.encode({ sub: user.id,
    iat: Math.round(Date.now() / 1000),
    exp: Math.round(Date.now() / 1000 + 5 * 60 * 60)}, keys.TOKEN_SECRET)
}

exports.signin = function(req, res, next) {
  res.send({
    token: tokenForUser(req.user)
  })
}

exports.currentUser = function(req, res) {
  res.send(req.user)
}

exports.signup = function(req, res, next) {
  const userName = req.body.userName
  const password = req.body.password

  console.log(userName)

  if (!userName || !password) {
    return res.status(422).send({ error: 'You must provide userName and password'})
  }

  // See if a user with the given userName exists
  User.findOne({ userName: userName }, function(err, existingUser) {
    if (err) { return next(err) }

    // If a user with userName does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'userName is in use' })
    }

    // If a user with userName does NOT exist, create and save user record
    const user = new User();

    user.userName = userName;

    user.setPassword(password);

    user.save(function(err, user) {
      if (err) { return next(err) }

      // Repond to request indicating the user was created
      res.json({ token: tokenForUser(user) })
    });
  });
}