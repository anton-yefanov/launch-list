import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: { type: String },

    // Array of startup IDs this user has submitted
    startups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup" }],

    // Optional: Twitter username for easier matching with submissions
    twitterUsername: { type: String },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ twitterUsername: 1 });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
