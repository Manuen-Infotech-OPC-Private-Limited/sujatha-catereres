// server.js — improved for Render / production
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet'); // optional but recommended
const rateLimit = require('express-rate-limit'); // optional but recommended
// const admin = require('firebase-admin');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

require('dotenv').config();

const app = express();

// ----- ALLOWED ORIGINS -----
let allowedOrigins = [];
if (process.env.ALLOWED_ORIGINS) {
  try {
    // ALLOWED_ORIGINS='["http://localhost:3000","http://localhost:5173"]'
    allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
  } catch (e) {
    // Fallback: comma-separated string
    // allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

  }
}
if (!allowedOrigins.length) {
  // Safe defaults
  allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
}
console.log('Allowed origins:', allowedOrigins);

app.use(
  '/assets',
  express.static(path.join(__dirname, 'public'))
);

// const isProd = process.env.NODE_ENV === 'production';
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('Time to initialize server...');

// Basic rate limiter (adjust as needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // allow 200 requests per window per IP
});
app.set('trust proxy', 1);

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming origin:', origin); // DEBUG
    if (!origin) {
      // Allow requests from server or curl (no origin)
      callback(null, true);
      return;
    }

    // Normalize: remove trailing slash
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log('Blocked CORS origin:', origin);
      callback(new Error('CORS blocked: ' + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};



app.use(cors(corsOptions));


// ----- COMMON MIDDLEWARE -----
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(limiter);
console.log('Middleware configured');

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes (ensure these files exist)
// ----- ROUTES -----
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const visitRoute = require('./routes/visitRoutes');
app.use('/api/visit', visitRoute);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const consultationRoutes = require('./routes/consultationRoutes');
app.use('/api/consultations', consultationRoutes);

const adminAuthRoutes = require('./routes/adminAuth');
app.use('/api/admin', adminAuthRoutes);

const adminAnalytics = require('./routes/adminAnalytics');
app.use('/api/admin', adminAnalytics);

const galleryRoutes = require('./routes/galleryRoutes');
app.use('/api/gallery', galleryRoutes);

const menuRoutes = require("./routes/menuRoutes")
app.use("/api/menu", menuRoutes);

const paymentRoutes = require("./routes/payments")
app.use("/api/payments", paymentRoutes);

// Create HTTP server and Socket.IO for real-time
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('register', ({ role, userId } = {}) => {
    console.log('REGISTER EVENT:', { role, userId });

    if (role === 'admin') {
      socket.join('admins');
      console.log(`Socket ${socket.id} joined room "admins"`);
    }

    if (userId) {
      const room = String(userId);
      socket.join(room);
      console.log(`Socket ${socket.id} joined user room "${room}"`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
console.log(`PORT set to ${PORT}`);

// Mongoose connect
console.log('Attempting MongoDB connection...');
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: 'sc-users-db',
  })
  .then(() => {
    console.log('Connected to MongoDB');

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

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
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


module.exports = app;