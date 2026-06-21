const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const Student = require("../models/Student");

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
// GOOGLE LOGIN
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Student.findOne({
          googleId: profile.id
        });

        if (user) {
          return done(null, user);
        }

        user = await Student.findOne({
          email: profile.emails[0].value
        });

        if (user) {
          user.googleId = profile.id;
          user.provider = "google";
          await user.save();
          return done(null, user);
        }

        const newUser = await Student.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          password: "GOOGLE_AUTH",
          googleId: profile.id,
          provider: "google"
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// GITHUB LOGIN
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Student.findOne({
          githubId: profile.id
        });

        if (user) {
          return done(null, user);
        }

        const email =
          profile.emails && profile.emails.length
            ? profile.emails[0].value
            : `${profile.username}@github.com`;

        user = await Student.findOne({ email });

        if (user) {
          user.githubId = profile.id;
          user.provider = "github";
          await user.save();
          return done(null, user);
        }

        const newUser = await Student.create({
          username: profile.username || profile.displayName,
          email,
          password: "GITHUB_AUTH",
          githubId: profile.id,
          provider: "github"
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Student.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;