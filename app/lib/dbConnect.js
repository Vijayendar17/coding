import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => {
      console.log("Successfully connected to MongoDB");
      return mongoose;
    }).catch(error => {
      console.error("Failed to connect to MongoDB:", error);
      throw new Error("Database connection failed");
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; 
    throw error;
  }

  return cached.conn;
};

export default connectToDatabase;