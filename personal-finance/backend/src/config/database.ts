import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Configure dotenv with the correct path
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;