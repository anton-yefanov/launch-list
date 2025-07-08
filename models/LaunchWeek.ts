import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export type ILaunchWeek = {
  _id: string;
  startDate: Date;
  endDate: Date;
  startupsLaunchIds: Array<string>;
  maxSlots: number;
};

const LaunchWeekSchema = new mongoose.Schema<ILaunchWeek>({
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
  mongoose.model<ILaunchWeek>("LaunchWeek", LaunchWeekSchema);
