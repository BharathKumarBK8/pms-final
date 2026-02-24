const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { readUsers, findUserById } = require("./utils/userStore");

// ---------- Local Strategy ----------
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const users = readUsers();
      const user = users.find((u) => u.email === email);

      if (!user || !user.password) return done(null, false);

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false);

      done(null, user);
    },
  ),
);

// ---------- Session ----------
passport.serializeUser((user, done) => {
  if (user.type === "guest") {
    done(null, { id: user.id, type: "guest", role: "customer" });
  } else {
    done(null, { id: user.id, type: "user" });
  }
});

passport.deserializeUser(async (obj, done) => {
  try {
    if (obj.type === "guest") return done(null, obj);

    const user = await findUserById(obj.id);
    if (!user) return done(null, false);

    return done(null, { ...user, id: obj.id, type: "user" });
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
