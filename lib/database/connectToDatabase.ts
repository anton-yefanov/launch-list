import mongoose from "mongoose";
import { getDatabaseURI } from "@/lib/database/getDatabaseURI";
import "@/models/User";
import "@/models/Startup";
import "@/models/Directory";
import "@/models/LaunchWeek";

let isConnected = false;

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  const uri = getDatabaseURI();
  console.log(`Connecting to database: ${uri.split("@")[1]}`);
  if (isConnected) {
    return mongoose;
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to database:", mongoose.connection.db?.databaseName);
    isConnected = true;
    return mongoose;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
