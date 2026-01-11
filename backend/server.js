// // server.js — improved for Render / production
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// // const helmet = require('helmet'); // optional but recommended
// const rateLimit = require('express-rate-limit'); // optional but recommended
// // const admin = require('firebase-admin');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');

// require('dotenv').config();

// const app = express();

// // ----- ALLOWED ORIGINS -----
// // const cors = require("cors");

// // Hardcoded allowed origins
// const allowedOrigins = [
//   "https://sujathacaterers.com",
//   "https://www.sujathacaterers.com",
//   "http://localhost:3000", "http://localhost:5173", 'http://127.0.0.1:3000',
// ];

// console.log("Allowed origins:", allowedOrigins);

// const corsOptions = {
//   origin: function (origin, callback) {
//     // console.log("Incoming origin:", origin);

//     // Allow requests with no origin (server-side, curl, old browsers)
//     if (!origin) {
//       callback(null, true);
//       return;
//     }

//     // Normalize origin: remove trailing slash
//     const normalizedOrigin = origin.replace(/\/$/, "");

//     if (allowedOrigins.includes(normalizedOrigin)) {
//       callback(null, true);
//     } else {
//       console.log("Blocked CORS origin:", origin);
//       callback(new Error("CORS blocked: " + origin));
//     }
//   },
//   credentials: true, // needed for cookies / JWTs
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

// // Handle preflight requests for all routes
// app.options(/.*/, cors(corsOptions));
// app.use(
//   '/assets',
//   express.static(path.join(__dirname, 'public'))
// );

// // const isProd = process.env.NODE_ENV === 'production';
// console.log('NODE_ENV:', process.env.NODE_ENV);

// console.log('Time to initialize server...');

// // Basic rate limiter (adjust as needed)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200, // allow 200 requests per window per IP
// });
// app.set('trust proxy', 1);

// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     console.log('Incoming origin:', origin); // DEBUG
// //     if (!origin) {
// //       // Allow requests from server or curl (no origin)
// //       callback(null, true);
// //       return;
// //     }

// //     // Normalize: remove trailing slash
// //     const normalizedOrigin = origin.replace(/\/$/, '');

// //     if (allowedOrigins.includes(normalizedOrigin)) {
// //       callback(null, true);
// //     } else {
// //       console.log('Blocked CORS origin:', origin);
// //       callback(new Error('CORS blocked: ' + origin));
// //     }
// //   },
// //   credentials: true,
// //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// // };



// // app.use(cors(corsOptions));


// // ----- COMMON MIDDLEWARE -----
// app.use(express.json({ limit: '10mb' }));
// app.use(cookieParser());
// app.use(limiter);
// console.log('Middleware configured');

// // Health check
// app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// // Routes (ensure these files exist)
// // ----- ROUTES -----
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// const visitRoute = require('./routes/visitRoutes');
// app.use('/api/visit', visitRoute);

// const orderRoutes = require('./routes/orderRoutes');
// app.use('/api/orders', orderRoutes);

// const consultationRoutes = require('./routes/consultationRoutes');
// app.use('/api/consultations', consultationRoutes);

// const adminAuthRoutes = require('./routes/adminAuth');
// app.use('/api/admin', adminAuthRoutes);

// const adminAnalytics = require('./routes/adminAnalytics');
// app.use('/api/admin', adminAnalytics);

// const galleryRoutes = require('./routes/galleryRoutes');
// app.use('/api/gallery', galleryRoutes);

// const menuRoutes = require("./routes/menuRoutes")
// app.use("/api/menu", menuRoutes);

// const paymentRoutes = require("./routes/payments")
// app.use("/api/payments", paymentRoutes);

// const complaintRoutes = require("./routes/complaintRoutes")
// app.use("/api/complaints", complaintRoutes);

// // Create HTTP server and Socket.IO for real-time
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// io.on('connection', (socket) => {
//   console.log('Socket connected:', socket.id);

//   socket.on('register', ({ role, userId } = {}) => {
//     console.log('REGISTER EVENT:', { role, userId });

//     if (role === 'admin') {
//       socket.join('admins');
//       console.log(`Socket ${socket.id} joined room "admins"`);
//     }

//     if (userId) {
//       const room = String(userId);
//       socket.join(room);
//       console.log(`Socket ${socket.id} joined user room "${room}"`);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Socket disconnected:', socket.id);
//   });
// });

// app.set('io', io);

// const PORT = process.env.PORT || 5000;
// console.log(`PORT set to ${PORT}`);

// // Mongoose connect
// console.log('Attempting MongoDB connection...');
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     dbName: 'sc-users-db',
//   })
//   .then(() => {
//     console.log('Connected to MongoDB');

//     server.listen(PORT, "0.0.0.0", () => {
//       console.log(`Server running on port ${PORT}`);
//     });

//     const shutdown = () => {
//       console.log('Shutting down gracefully...');
//       server.close(() => {
//         console.log('HTTP server closed.');
//         mongoose.connection.close(false, () => {
//           console.log('MongoDB connection closed.');
//           process.exit(0);
//         });
//       });
//     };
//     process.on('SIGTERM', shutdown);
//     process.on('SIGINT', shutdown);
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   });


// module.exports = app;


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
];

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
function shutdown() {
  console.log('Graceful shutdown...');
  server.close(() => {
    mongoose.connection.close(false, () => process.exit(0));
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
