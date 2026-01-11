const jwt = require('jsonwebtoken');

module.exports = function sseAuth(req, res, next) {
  const token =
    req.query.token ||
    req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).end();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).end();
  }
};
