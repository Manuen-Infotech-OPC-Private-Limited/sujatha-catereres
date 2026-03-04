// server.js — Render-safe SSE production version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const http = require('http');
const path = require('path');
require('dotenv').config();

const app = express();

/* ---------- CORS ---------- */
const allowedOrigins = [
  "https://sujathacaterers.com",
  "https://www.sujathacaterers.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "https://admin.sujathacaterers.com"
];

console.log("Allowed origins:", allowedOrigins);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const normalized = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalized)) cb(null, true);
    else cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use('/assets', express.static(path.join(__dirname, 'public')));

/* ---------- MIDDLEWARE ---------- */
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
}));

/* ---------- HEALTH ---------- */
app.get('/health', (_, res) => res.json({ status: 'ok' }));

/* ---------- ROUTES ---------- */
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/visit', require('./routes/visitRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/consultations', require('./routes/consultationRoutes'));
app.use('/api/admin', require('./routes/adminAuth'));
app.use('/api/admin', require('./routes/adminAnalytics'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

/* ---------- SSE ---------- */
app.use('/sse', require('./routes/sseRoutes'));

/* ---------- SERVER ---------- */
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, { dbName: 'sc-users-db' })
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, '0.0.0.0', () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });

/* ---------- GRACEFUL SHUTDOWN ---------- */
async function shutdown() {
  console.log('Graceful shutdown...');

  try {
    await new Promise((resolve, reject) => {
      server.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    await mongoose.connection.close(false);
    console.log('Server and MongoDB closed.');
    process.exit(0);
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
