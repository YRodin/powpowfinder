
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

exports.updateInfo = function (req, res, next) {
  //update password? model.setPassword()
  if(req.body.password) {
    User.findById(req.user._id, (err, user) => {
      if(err) { next(err); }
      else {
        user.setPassword(req.body.password);
        user.save();
      }
    });
  }
  //udpdate user name or ski pass
  User.findByIdAndUpdate(req.user._id, req.body, function(err, user) {
    if(err) { res.status(500).json({ error: 'Failed to update account' })} 
    else {
      user.save((err, user) => {
        if (err) { console.log(err); }
        else {
          console.log(user);
          res.json(user)
        }
      });
    }
  })
}

exports.delete = function (req, res, next) {
  // delete DB entry
  // redirect to /home
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) { return next(err) }
    else {
      res.status(204).json({ message: 'User deleted successfully'});
    }
  })
}