import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const LaunchWeekSchema = new mongoose.Schema({
  startsAt: Date,
  endsAt: Date,
  startupsLaunchIds: [ObjectId],
  maxSlots: Number,
  status: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.models.LaunchWeek ||
  mongoose.model("LaunchWeek", LaunchWeekSchema);
