require('dotenv').config();
const express = require('express');
const session = require('express-session');
const protectConfig = require('protect-config');
const config = require('./config/config');
const logger = require('./config/winston')(module);
const { connection } = require('./config/persistance');

const env = process.env.NODE_ENV || process.env.ENV || 'development';

// Load protected config in non-development environments
if (env !== 'development') {
  protectConfig.init(`./config/${env}.js`, null, config.extras.key);
}

// Initialize database connection
(async () => {
  try {
    await connection();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
  }
})();

const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Load Express configurations (routes, middlewares, etc.)
require('./config/express')(app, config);

// Start server
app.listen(config.port, () => logger.info(`Server running on port ${config.port}`));
