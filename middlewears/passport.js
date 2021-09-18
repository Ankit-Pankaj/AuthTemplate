const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/variables").variables.JWT_SECRET;

const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
console.log("secet is",JWT_SECRET)
const User = require("../user/schema");

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log("payload received", jwt_payload);
  User.findOne({ _id: jwt_payload.userId })
    .then((user) => {
      if (user) {
        return next(null, user);
      } else {
        return next(null, false);
      }
    })
    .catch((err) => next(err, null));
});

module.exports = function (passport) {
  passport.use(strategy);
};
