import * as mongoose from "mongoose";
import { generateSlug } from "@/utils/generateSlug";

export type IStartup = {
  _id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  tagline: string;
  description: string;
  categories: string[];
  logo: {
    id: string;
    name: string;
    url: string;
    mimeType: string;
    size: number;
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

  status: "pending" | "approved" | "rejected" | "launched";
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
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[a-z0-9-]+$/.test(v);
        },
        message:
          "Slug can only contain lowercase letters, numbers, and hyphens",
      },
    },
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
      enum: ["pending", "approved", "rejected", "launched"],
      default: "pending",
    },

    rejectionReason: { type: String },
    rejectionCategory: { type: String },

    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    reviewedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to generate slug
StartupSchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isNew) {
    const baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    while (
      await mongoose.models.Startup.findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

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
