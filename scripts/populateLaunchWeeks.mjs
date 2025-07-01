import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://antonyefanov:9E9f3a4Antongogi@cluster0.xd3no.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error(
    "[connectToDatabase.ts]: Please define the MONGODB_URI environment variable",
  );
}

let isConnected = false;

export const connectToDatabase = async () => {
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

const launchWeekSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startupsLaunchIds: [ObjectId],
  maxSlots: Number,
});

const LaunchWeek =
  mongoose.models.LaunchWeek || mongoose.model("LaunchWeek", launchWeekSchema);

const populateLaunchWeeks = async () => {
  try {
    await connectToDatabase();

    const existingWeeks = await LaunchWeek.countDocuments();
    if (existingWeeks > 0) {
      console.log(
        "LaunchWeek collection is not empty. Aborting script to prevent duplicates.",
      );
      return;
    }

    console.log("Populating LaunchWeek collection...");

    const launchWeeks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    // Calculate the most recent Monday (including today if it's Monday)
    const thisMonday = new Date(today);
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const daysSinceMonday = (dayOfWeek + 6) % 7; // Calculate how many days have passed since Monday
    thisMonday.setDate(today.getDate() - daysSinceMonday);

    for (let i = 0; i < 52; i++) {
      const startDate = new Date(thisMonday);
      startDate.setDate(thisMonday.getDate() + i * 7);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      launchWeeks.push({
        startDate,
        endDate,
        maxSlots: 50,
      });
    }

    await LaunchWeek.insertMany(launchWeeks);

    console.log(
      `Successfully inserted ${launchWeeks.length} launch weeks into the database.`,
    );
  } catch (error) {
    console.error("An error occurred while populating launch weeks:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

populateLaunchWeeks();
