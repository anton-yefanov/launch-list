import mongoose from "mongoose";

const LaunchWeekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  theme: String,
  isActive: { type: Boolean, default: false },
  featuredStartups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup" }],
});

export default mongoose.models.LaunchWeek ||
  mongoose.model("LaunchWeek", LaunchWeekSchema);
