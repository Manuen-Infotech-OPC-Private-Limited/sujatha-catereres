const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const allowedOrigins = ['http://localhost:3000'];

console.log('Initializing server...');

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    console.log(`CORS check for origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('Origin allowed by CORS');
      callback(null, true);
    } else {
      console.warn(`CORS error: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// JSON middleware
app.use(express.json());
app.use(cookieParser());
console.log('Middleware configured');

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
console.log('User routes configured at /api/users');

const visitRoute = require('./routes/visitRoutes');
app.use('/api/visit', visitRoute);
console.log('Visit route configured at /api/visit');

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
console.log("Order routes configured at /api/orders")
const PORT = process.env.PORT || 5000;
console.log(`PORT set to ${PORT}`);

console.log('Attempting MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sc-users-db',
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
