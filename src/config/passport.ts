import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserById } from "../controllers/user.js"; // your DB helpers

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" }, // expect email instead of username
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Wrong password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize: save user ID in session
passport.serializeUser((user: any, done) => {
  console.log("Authenticated user:", user);
  done(null, user.userId);
});

// Deserialize: get full user from DB using ID
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await findUserById(id);
    console.log("Authenticated user:", user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
