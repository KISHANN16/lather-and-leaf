import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lather-leaf';
    console.log(`Connecting to MongoDB...`);
    
    // Set bufferCommands to false to fail fast if not connected
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('--------------------------------------------------');
    console.log('WARNING: MongoDB is not running or unreachable.');
    console.log('Falling back to local JSON database mode (data/db.json).');
    console.log('--------------------------------------------------');
    global.isUsingFallback = true;
    return false;
  }
};

export default connectDB;
