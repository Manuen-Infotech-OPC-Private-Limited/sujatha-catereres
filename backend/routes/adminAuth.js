// routes/adminAuth.js
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "123456";

// Static credentials (store in .env for security)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin@sujathacaterers.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sc@admin#1";

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.json({ message: "Login successful", token });
});

module.exports = router;
