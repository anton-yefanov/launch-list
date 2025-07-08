import mongoose from "mongoose";
import "@/models/User";
import "@/models/Startup";
import "@/models/Directory";
import "@/models/LaunchWeek";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "[connectToDatabase.ts]: Please define the MONGODB_URI environment variable",
  );
}

let isConnected = false;

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (isConnected) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    return mongoose;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
