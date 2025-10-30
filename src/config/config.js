// src/config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/pgmanagement', // Use your cloud MongoDB URI here
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '1d', // Example: 1 day
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: +process.env.EMAIL_PORT || 587,
    secure: Boolean(process.env.EMAIL_SECURE) || false, // true for 465, false for other ports
    user: process.env.EMAIL_USER || 'avinashgunturu123@gmail.com',
    pass: process.env.EMAIL_PASS || 'wuhu zkhb wwdx vnts',
    from: process.env.EMAIL_FROM || 'avinashgunturu123@gmail.com',
  },
  // ... other configurations
};