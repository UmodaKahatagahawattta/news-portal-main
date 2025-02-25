const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const db_connect = async () => {
  try {
    // Use the database name from the environment variable or set it dynamically
    const dbName = process.env.MONGO_DB_NAME || 'news'; // Default to 'newDatabaseName' if not specified
    const mongoUri = process.env.MONGO_URI.replace('<DB_NAME>', dbName);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected to ${dbName} 🚀`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

module.exports = db_connect;

