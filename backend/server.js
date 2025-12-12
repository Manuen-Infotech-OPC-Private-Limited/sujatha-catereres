// server.js — improved for Render / production
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet'); // optional but recommended
const rateLimit = require('express-rate-limit'); // optional but recommended
const admin = require('firebase-admin');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const app = express();

// Allowed origins: take from env or fallback to localhost for local dev
// const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ----- ALLOWED ORIGINS -----
let allowedOrigins = [];
if (process.env.ALLOWED_ORIGINS) {
  try {
    // ALLOWED_ORIGINS='["http://localhost:3000","http://localhost:5173"]'
    allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
  } catch (e) {
    // Fallback: comma-separated string
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  }
}
if (!allowedOrigins.length) {
  // Safe defaults
  allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
}
console.log('Allowed origins:', allowedOrigins);

// const isProd = process.env.NODE_ENV === 'production';
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('Time to initialize server...');

// Security middleware (optional but recommended)
// app.use(helmet({
//   crossOriginOpenerPolicy: false,
//   crossOriginResourcePolicy: false,
//   crossOriginEmbedderPolicy: false
// }));

// Basic rate limiter (adjust as needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // allow 200 requests per window per IP
});
app.use(limiter);
app.set('trust proxy', 1);

// ----- CORS FOR REST API -----
// app.use(cors({
//   origin: function (origin, callback) {
//     if (isProd) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error('Not allowed by CORS'));
//     }

//     // Dev mode
//     if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//     callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
// }));

// ----- CORS FOR REST API -----
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow non-browser clients or same-origin
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     console.error('Blocked by CORS:', origin);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
// }));

app.use(cors({
  origin: allowedOrigins,   // array of allowed origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));



// ----- COMMON MIDDLEWARE -----
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
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

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const consultationRoutes = require('./routes/consultationRoutes');
app.use('/api/consultations', consultationRoutes);

const adminAuthRoutes = require('./routes/adminAuth');
app.use('/api/admin', adminAuthRoutes);

const adminAnalytics = require('./routes/adminAnalytics');
app.use('/api/admin', adminAnalytics);

const galleryRoutes = require('./routes/galleryRoutes');
app.use('/api/gallery', galleryRoutes);


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