const express = require("express");
var router = express.Router();
var passport = require("passport");
var jwt = require("jsonwebtoken");
const utils = require("../utils");
const User = require("../user/schema");
const JWT_SECRET = require("../config/variables").variables.JWT_SECRET;

var jwtOptions = {};
jwtOptions.secretOrKey = JWT_SECRET;

router.get("/", function (req, res) {
  res.json({ message: "The app is running!" });
});

router.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.json({ message: "Success!" });
  }
);

router.get(
  "/secretDebug",
  function (req, res, next) {
    console.log(req.get("Authorization"));
    next();
  },
  function (req, res) {
    res.json("debugging");
  }
);

router.post("/login", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.status(401).json({ success: false, msg: "Invalid Credentials" });
    return;
  }
  User.findOne({ emailId: email }, (err, user) => {
    if (err) {
      res.status(500);
      return;
    }
    if (!user) {
      res.status(401).json({ sucess: false, msg: "no such user found" });
      return;
    }
    console.log("USER FOUND IS", user);
    utils
      .validPassword(password, user.password)
      .then((matched) => {
        if (matched) {
          let token = utils.issueJWT(user);
          res
            .status(200)
            .json({ success: true, token, msg: "Logged In Successfully" });
        } else {
          res.status(401).json({ success: false, msg: "Invalid Credentials" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({ success: false, msg: "Invalid Credentials" });
      });
  });
});

router.get("/register", (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    res.json({ success: false, msg: "Invalid Input" });
  }
  email = utils.sanitizeEmail(email);

  User.findOne({ emailId: email }, (err, user) => {
    if (err) {
      console.log("Error Occured", err);
      res.json({ success: false, msg: "Unknown error occured" });
    }
    if (user) {
      res.json({ success: false, msg: "user already exist" });
      return;
    }

    utils.genPassword(password).then((hash) => {
      // save in db
      const newUser = new User({
        emailId: email,
        password: hash
      });
      newUser
        .save()
        .then((user) => {
          let token = utils.issueJWT(user);
          console.log("New User created", user.emailId);
          res.json({ success: true, token, msg: "user created" });
        })
        .catch((err) => next(err));
    });
  });
});

module.exports = router;
