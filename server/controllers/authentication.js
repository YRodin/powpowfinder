const jwt = require("jwt-simple");
const User = require("../models/user");
const keys = require("../config/dev");

function tokenForUser(user) {
  return jwt.encode(
    {
      sub: user._id,
      iat: Math.round(Date.now() / 1000),
      exp: Math.round(Date.now() / 1000 + 5 * 60 * 60),
    },
    keys.TOKEN_SECRET
  );
}
exports.tokenForUser = tokenForUser;

exports.signin = function (req, res, next) {
  const token = tokenForUser(req.user);
  const { userName, seasonPass } = req.user;
  res.send({userName, seasonPass, token});
};

exports.currentUser = function (req, res, next) {
  console.log(`current user controller is invoked`);
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
};

exports.signup = function (req, res, next) {
  const userName = req.body.userName;
  const password = req.body.password;


  if (!userName || !password) {
    return res
      .status(422)
      .send({ error: "You must provide userName and password" });
  }

  // See if a user with the given userName exists
  User.findOne({ userName: userName }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    // If a user with userName does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "userName is in use" });
    }

    // If a user with userName does NOT exist, create and save user record
    const user = new User();

    user.userName = userName;

    user.setPassword(password);

    user.save(function (err, user) {
      if (err) {
        return next(err);
      }

      // Repond to request indicating the user was created
      const token = tokenForUser(user);
      const  {userName, seasonPass} = user;
      res.send({userName, seasonPass, token})
    });
  });
};
