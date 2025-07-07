import mongoose, { InferSchemaType } from "mongoose";
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

export type ILaunchWeek = InferSchemaType<typeof LaunchWeekSchema>;

export default mongoose.models.LaunchWeek ||
  mongoose.model<ILaunchWeek>("LaunchWeek", LaunchWeekSchema);
