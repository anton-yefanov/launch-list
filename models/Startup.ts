import * as mongoose from "mongoose";

export type IStartup = {
  _id: string;
  name: string;
  websiteUrl: string;
  tagline: string;
  description: string;
  categories: string[];
  logo?: {
    id?: string;
    name?: string;
    url?: string;
    mimeType?: string;
    size?: number;
  };
  screenshots?: {
    id?: string;
    name?: string;
    url?: string;
    mimeType?: string;
    size?: number;
  }[];
  submittedBy: string;
  submitterEmail: string;
  twitterUsername?: string;
  submissionRating?: number;
  userId: mongoose.Schema.Types.ObjectId;
  upvotes: mongoose.Schema.Types.ObjectId[];

  tallyEventId?: string;

  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  rejectionCategory?: string;

  submittedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  reviewedAt?: Date;
  upvoteCount?: number;
};

const StartupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
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

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    tallyEventId: { type: String, unique: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String }, // AI-generated reason for rejection
    rejectionCategory: { type: String }, // Category of rejection (gambling, adult, spam, etc.)

    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    reviewedAt: { type: Date }, // When AI review was completed
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Virtual for upvote count
StartupSchema.virtual("upvoteCount").get(function () {
  return this.upvotes ? this.upvotes.length : 0;
});

// Ensure virtual fields are serialized
StartupSchema.set("toJSON", { virtuals: true });
StartupSchema.set("toObject", { virtuals: true });

// Index for faster queries
StartupSchema.index({ submitterEmail: 1 });
StartupSchema.index({ userId: 1 });
StartupSchema.index({ status: 1 });
StartupSchema.index({ rejectionCategory: 1 });
StartupSchema.index({ upvotes: 1 });
StartupSchema.index({ tallyResponseId: 1 });
StartupSchema.index({ tallyFormId: 1 });

export const Startup =
  mongoose.models.Startup || mongoose.model<IStartup>("Startup", StartupSchema);
