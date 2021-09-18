const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = require("./config/variables").variables.JWT_SECRET;

function genPassword(password) {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log("some error occured", err);
        reject(err);
      }
      resolve(hash);
    });
  });
}

function sanitizeEmail(email) {
  return email.toLowerCase();
}

function issueJWT(user) {
  const userId = user._id.toString();
  const expiresIn = "5d";
  const payload = {
    userId,
    iat: Date.now()
  };
  const signedToken = jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn
  });

  return {
    token: signedToken,
    expires: expiresIn
  };
}

function validPassword(password, hash) {
  bcrypt.compare(hash, password, (err, res) => {
  });
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err);
      }
      if (!res) {
        reject("Invalid Credentials");
      }
      resolve(true);
    });
  });
}

module.exports.genPassword = genPassword;
module.exports.sanitizeEmail = sanitizeEmail;
module.exports.issueJWT = issueJWT;
module.exports.validPassword = validPassword;
