const mongoose = require('mongoose');

// Helpful default for Mongoose query parsing
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || 'jobportal';

    if (!rawUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }

    // Ensure retryWrites & w=majority are present for Atlas if not already provided
    let connectionUri = rawUri;
    if (!/[?&]retryWrites=/.test(connectionUri)) {
      connectionUri += (connectionUri.includes('?') ? '&' : '?') + 'retryWrites=true';
    }
    if (!/[?&]w=/.test(connectionUri)) {
      connectionUri += (connectionUri.includes('?') ? '&' : '?') + 'w=majority';
    }

    const conn = await mongoose.connect(connectionUri, {
      dbName,
      serverSelectionTimeoutMS: 10000, // fail fast if cluster unreachable
      socketTimeoutMS: 20000,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}/${dbName}`);

    // Basic connection event diagnostics
    mongoose.connection.on('error', (err) => {
      console.error('⚠️  Mongoose connection error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  Mongoose disconnected');
    });
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    // Add a few common hints
    console.error('👉 Tips: verify your MongoDB Atlas IP whitelist, username/password, and that your URI is correct.');
    process.exit(1);
  }
};

module.exports = connectDB;
