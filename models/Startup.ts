import * as mongoose from "mongoose";

const StartupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    tagline: { type: String, required: true },
    logo: {
      id: String,
      name: String,
      url: String,
      mimeType: String,
      size: Number,
    },
    screenshots: [
      {
        id: String,
        name: String,
        url: String,
        mimeType: String,
        size: Number,
      },
    ],
    submittedBy: { type: String, required: true }, // Name of the person who submitted
    submitterEmail: { type: String, required: true },
    twitterUsername: { type: String }, // Optional
    submissionRating: { type: Number }, // Rating given for submission experience
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Tally form metadata
    tallyEventId: { type: String, unique: true },
    tallyResponseId: { type: String, unique: true },
    tallySubmissionId: { type: String },
    tallyRespondentId: { type: String },

    // Status and approval workflow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Timestamps
    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Index for faster queries
StartupSchema.index({ submitterEmail: 1 });
StartupSchema.index({ userId: 1 });
StartupSchema.index({ status: 1 });
StartupSchema.index({ tallyEventId: 1 });

export const Startup =
  mongoose.models.Startup || mongoose.model("Startup", StartupSchema);
