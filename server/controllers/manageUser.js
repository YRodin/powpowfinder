const authentication = require("./authentication");
const User = require("../models/user");

exports.addPass = function (req, res, next) {
  // find and update user in db
  User.findOne({ userName: req.user.userName }, function (err, user) {
    if (err) {
      next(err);
    } else {
      user.seasonPass = req.body.seasonPass;
      user.save((err, user) => {
        if (err) {
          return next(err);
        }
        res.json(user);
      });
    }
  });
};

exports.updateInfo = async (req, res, next) => {
  const updatedUser = {
    userName: "",
    seasonPass: "",
    token: "",
  };
  for (const prop in req.body) {
    // loop over each property in request body and update user
    switch (prop) {
      case "password":
        console.log("case password is invoked");
        try {
          const user = await User.findById(req.user._id);
          user.setPassword(req.body.password);
          await user.save();
        } catch (err) {
          next(err);
        }
        break;

      case "userName":
        //instructions
        console.log(
          `case userName is invoked with new user name: ${req.body.userName}`
        );
        try {
          const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
          });
          updatedUser.userName = user.userName;
          await user.save();
        } catch (err) {
          next(err);
        }
        break;

      case "seasonPass":
        //instructions
        console.log(
          `case seasonPass is invoked with new seasonPass: ${req.body.seasonPass}`
        );
        try {
          const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
          });
          updatedUser.seasonPass = user.seasonPass;
          await user.save();
        } catch (err) {
          next(err);
        }
        break;

      default:
        console.log("nothing is passed with req.body to update user!");
    }
  }
    //generate new token for user
    updatedUser.token = authentication.tokenForUser(req.user);

    //send response back to client
    res.send({
      userName: updatedUser.userName,
      seasonPass: updatedUser.seasonPass,
      token: updatedUser.token,
    });
  }

exports.delete = function (req, res, next) {
  // delete DB entry
  // redirect to /home
  console.log("user delete api route is invoked");
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    } else {
      res.status(204).json({ message: "User deleted successfully" });
    }
  });
};
