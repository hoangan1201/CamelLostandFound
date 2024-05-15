import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "dotenv";
import { db } from "./index.js";

env.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log("Email", profile.emails[0].value);
      console.log("Name ", profile.displayName);
      // cb(null, profile);
      try {
        const checkResult = await db.query(
          "SELECT * FROM users where email = $1",
          [profile.emails[0].value]
        );
        if (checkResult.rows.length == 0) {
          const addResult = await db.query(
            "INSERT INTO users (email, name, role) VALUES ($1,$2,'user') RETURNING *",
            [profile.emails[0].value, profile.displayName]
          );
          cb(null, addResult.rows[0]);
        } else {
          cb(null, checkResult.rows[0]);
        }
      } catch (error) {}
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
