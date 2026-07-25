const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('MONGO_URI not set. Skipping database connection for now.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
  }
};

module.exports = connectDB;
