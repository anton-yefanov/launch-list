import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const LaunchWeekSchema = new mongoose.Schema({
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

export default mongoose.models.LaunchWeek ||
  mongoose.model("LaunchWeek", LaunchWeekSchema);
