
const User = require('../models/user')

exports.addPass = function (req, res, next) {
  // find and update user in db
  User.findOne({userName: req.user.userName}, function(err, user){
    if(err) { next(err) }
    else {
      user.seasonPass = req.body.seasonPass;
      user.save((err, user) =>{
        if(err) { return next(err) }
        res.json(user);
      })
    }
  })  
}

exports.udateInfo = function (req, res, next) {
  // update User info in data base
  // respond with updated token and user
  User.findOne({userName: req.body.userName}, function(err, user) {
    if(err) { return next(err) } 
    else {
      // update user password requires rehashing user.setpassword()? 
      // decide how client will pass info that is iupdating user
      req.body.newPassword ? user.setPassword(req.body.newPassword) : null;

      user = {...user, userName: {...req.body.
        newUserName}, seasonPass: {...req.body.newSeasonPass}}
      user.save((err, user) => {
        if(err) { return next(err) }
        res.json(user);
      })
    }
  })
}

exports.delete = function (req, res, next) {
  // delete DB entry
  // redirect to /home
  User.findOneAndDelete({userName: req.user.userName}, (err, user) => {
    if (err) { return next(err) }
    else {
      res.status(204).json({ message: 'User deleted successfully'});
    }
  })
}