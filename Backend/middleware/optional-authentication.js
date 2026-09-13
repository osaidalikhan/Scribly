const jwt = require("jsonwebtoken");

// Like `authentication.js`, but never throws — used on routes that behave
// slightly differently for logged-in users (e.g. "have I liked this post?")
// without requiring a login to view them at all.
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
  } catch (error) {
    // invalid/expired token — just continue as an anonymous request
  }
  next();
};

module.exports = optionalAuth;
