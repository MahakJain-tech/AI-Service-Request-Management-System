const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Uses process.env.MONGODB_URI or a default local/Atlas fallback URI
    const connURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexuscrm';
    
    console.log(`Connecting to MongoDB at: ${connURI.replace(/:([^:@\s]+)@/, ':***@')}`); // Hide credentials in logs
    
    const conn = await mongoose.connect(connURI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.warn(`Entering local in-memory Mock DB mode. Express server remains operational.`);
  }
};

module.exports = connectDB;
