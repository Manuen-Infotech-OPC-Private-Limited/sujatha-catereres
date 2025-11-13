const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "123456";

const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
