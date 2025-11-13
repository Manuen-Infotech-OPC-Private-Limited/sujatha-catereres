// server.js — improved for Render / production
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // optional but recommended
const rateLimit = require('express-rate-limit'); // optional but recommended
const admin = require('firebase-admin');

require('dotenv').config();

const app = express();

// Allowed origins: take from env or fallback to localhost for local dev
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = Array.isArray(process.env.ALLOWED_ORIGINS)
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [CLIENT_URL];

const isProd = process.env.NODE_ENV === 'production';

console.log('Initializing server...');

// Security middleware (optional but recommended)
app.use(helmet());

// Basic rate limiter (adjust as needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // allow 200 requests per window per IP
});
app.use(limiter);

app.use(cors({
  origin: function (origin, callback) {
    console.log(`CORS check for origin: ${origin}`);

    if (isProd) {
      if (!origin) {
        console.log('No origin header — allowing (server-to-server or health check)');
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log(`Origin ${origin} allowed by CORS`);
        return callback(null, true);
      } else {
        console.warn(`CORS error: Origin ${origin} not allowed`);
        return callback(new Error('Not allowed by CORS'));
      }
    }

    // Dev mode
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


// JSON middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
console.log('Middleware configured');

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes (ensure these files exist)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
console.log('User routes configured at /api/users');

const visitRoute = require('./routes/visitRoutes');
app.use('/api/visit', visitRoute);
console.log('Visit route configured at /api/visit');

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
console.log('Order routes configured at /api/orders');

const PORT = process.env.PORT || 5000;
console.log(`PORT set to ${PORT}`);

// Initialize Firebase admin from env JSON (if used)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase admin initialized from env.');
  } catch (err) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', err);
  }
} else {
  console.log('No FIREBASE_SERVICE_ACCOUNT env var provided. If you use Firebase, set it in Render.');
}

// Mongoose connect
console.log('Attempting MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sc-users-db',
  // useNewUrlParser: true, // mongoose >=6 has this by default
  // useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Graceful shutdown (Render sends SIGTERM)
    const shutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
