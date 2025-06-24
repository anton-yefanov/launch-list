import mongoose from "mongoose";

const StartupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: String,
  website: { type: String, required: true },
  logo: String,
  categories: [String],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  launchWeek: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "featured"],
    default: "pending",
  },
  votes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Startup ||
  mongoose.model("Startup", StartupSchema);
