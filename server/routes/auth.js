const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { readUsers, writeUsers } = require("../utils/userStore");

// ---------- Helper ----------
const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

// ---------- Guest Login ----------
router.post("/guest", (req, res, next) => {
  const guestUser = {
    id: `guest-${Date.now()}`,
    type: "guest",
    role: "customer",
  };

  req.login(guestUser, (err) => {
    if (err) return next(err);

    // Set guest session for 24 hours
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24;

    req.session.save((err) => {
      if (err) return next(err);

      res.json({
        message: "Guest session created",
        user: guestUser,
      });
    });
  });
});

// ---------- Upgrade Guest to Native User ----------
router.post("/guest/upgrade", async (req, res, next) => {
  const { displayName, email, password } = req.body;
  if (!req.user || req.user.type !== "guest") {
    return res.status(400).json({ message: "No guest session found" });
  }

  if (!displayName || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const users = readUsers();
  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: "Email exists" });

  const newUser = {
    id: Date.now().toString(),
    displayName,
    email,
    password: await bcrypt.hash(password, 10),
    authProvider: "native",
    type: "user",
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  // Replace guest session with new user session
  req.login(newUser, (err) => {
    if (err) return next(err);

    // Optional: reset cookie age for full user session
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // 24h or longer

    req.session.save((err) => {
      if (err) return next(err);
      res.json({ message: "Guest upgraded to user", user: newUser });
    });
  });
});

// ---------- Native Signup ----------
router.post("/native/signup", async (req, res) => {
  const { displayName, email, password } = req.body;
  if (!displayName || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const users = readUsers();
  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: "Email exists" });

  const newUser = {
    id: Date.now().toString(),
    displayName,
    email,
    password: await bcrypt.hash(password, 10),
    authProvider: "native",
    type: "user",
    role: "staff",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ message: "User registered", user: newUser });
});

// ---------- Native Login ----------
router.post("/native/login", passport.authenticate("local"), (req, res) => {
  const { password, ...safeUser } = req.user;
  res.json(safeUser);
});

// ---------- Logout ----------
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid", COOKIE_OPTIONS);
      res.json({ message: "Logged out" });
    });
  });
});

// ---------- Current User ----------
router.get("/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  const { password, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// ---------- Auth Failure ----------
router.get("/failure", (_, res) => res.send("Auth failed"));

module.exports = router;
