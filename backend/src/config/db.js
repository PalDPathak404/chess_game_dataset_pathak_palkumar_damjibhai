const mongoose = require('mongoose');
const config = require('./index');

/**
 * Establish a connection to the MongoDB database.
 * 
 * Uses environment variables for the connection URI.
 * Exits the process if the connection fails, ensuring the server
 * does not start without a working database connection.
 */
const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    const conn = await mongoose.connect(config.mongoUri);

    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    // Terminate startup safely on DB failure
    process.exit(1);
  }
};

module.exports = connectDB;
