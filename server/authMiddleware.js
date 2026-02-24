// authMiddleware.js
function ensureAuth(...roles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden. Insufficient permissions." });
    }

    next();
  };
}

module.exports = { ensureAuth };
