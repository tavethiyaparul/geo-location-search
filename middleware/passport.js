const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../models/user.model');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECERT,
};

module.exports = (passport)=>{
    passport.use(
        new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
          try {
            const user = await User.findById(jwtPayload.id);
            if (user) {
              console.log("user", user);
              return done(null, user);
            } else {
              return done(null, false);
            }
          } catch (err) {
            return done(err, false);
          }
        })
      );
}


