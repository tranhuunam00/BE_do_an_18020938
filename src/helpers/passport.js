const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const constants = require("../constants/constants");
passport.use(
  new GoogleStrategy(
    {
      clientID: constants.CALENDER_CLIENT_KEY,
      clientSecret: constants.CALENDER_SECRET_KEY,
      callbackURL: "http://localhost:5003/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);
