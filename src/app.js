// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/auth.routes');
const ownerRoutes = require('./routes/owner.routes');
const propertyRoutes = require('./routes/property.routes')
const tenantRoutes = require('./routes/tenant.routes');
const transactionRoutes = require('./routes/transaction.routes');
const employeeRoutes = require('./routes/employee.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const floorRoutes = require('./routes/floor.routes');

const app = express();

// Middleware
// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:5173','http://localhost:5174'], // Replace with your frontend URL
  methods: ['GET', 'POST','PUT','DELETE'], // Allowed methods
  credentials: true // Allow cookies if needed
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(config.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/floor', floorRoutes);


module.exports = app;