const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const constants = require("../constants/constants");
passport.use(
  new GoogleStrategy(
    {
      clientID:
        constants.CALENDER_CLIENT_KEY ||
        "538083935372-25hfb8q8gute01d17orr12d0139hk159.apps.googleusercontent.com",
      clientSecret:
        constants.CALENDER_SECRET_KEY || "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",
      callbackURL: "http://localhost:5003/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);
