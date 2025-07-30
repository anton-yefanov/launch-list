import mongoose from "mongoose";
import { DirectoryTag, SubmitDifficulty } from "./Directory";

export enum SubmissionStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export type ISubmittedDirectory = {
  _id: string;
  name: string;
  description: string;
  url: string;
  submittedBy: mongoose.Schema.Types.ObjectId; // User ID who submitted
  status: SubmissionStatus;
  submitterEmail: string;
  tallyEventId: string; // Tally form submission ID
  submittedAt: Date;

  // Optional fields that might be provided
  bgColor?: string;
  domainRating?: number;
  viewsPerMonth?: number;
  tags?: DirectoryTag[];
  submitDifficulty?: SubmitDifficulty;

  // SEO fields (optional for submissions)
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  about?: string;

  createdAt?: Date;
  updatedAt?: Date;
};

const SubmittedDirectorySchema = new mongoose.Schema<ISubmittedDirectory>(
  {
    name: {
      type: String,
      required: [true, "Directory name is required"],
      trim: true,
      maxlength: [100, "Directory name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Please enter a valid URL",
      },
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Submitter is required"],
    },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.Pending,
      required: true,
    },
    submitterEmail: {
      type: String,
      required: [true, "Submitter email is required"],
      trim: true,
    },
    tallyEventId: {
      type: String,
      required: [true, "Tally event ID is required"],
      unique: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      required: [true, "Submission date is required"],
    },

    // Optional fields
    bgColor: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^#[0-9A-F]{6}$/i.test(v);
        },
        message: "Please enter a valid hex color code",
      },
    },
    domainRating: {
      type: Number,
      min: [0, "Domain rating must be at least 0"],
      max: [100, "Domain rating cannot exceed 100"],
    },
    viewsPerMonth: {
      type: Number,
      min: [0, "Views per month must be at least 0"],
    },
    tags: [
      {
        type: String,
        enum: Object.values(DirectoryTag),
      },
    ],
    submitDifficulty: {
      type: String,
      enum: Object.values(SubmitDifficulty),
    },

    // SEO fields
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "SEO description cannot exceed 160 characters"],
    },
    h1: {
      type: String,
      trim: true,
      maxlength: [100, "H1 cannot exceed 100 characters"],
    },
    about: {
      type: String,
      trim: true,
      maxlength: [1000, "About cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    collection: "submittedDirectories",
  },
);

// Indexes for efficient querying
SubmittedDirectorySchema.index({ submittedBy: 1 });
SubmittedDirectorySchema.index({ status: 1 });
SubmittedDirectorySchema.index({ createdAt: -1 });
SubmittedDirectorySchema.index({ url: 1 });
SubmittedDirectorySchema.index({ submitterEmail: 1 });

export default mongoose.models.SubmittedDirectory ||
  mongoose.model<ISubmittedDirectory>(
    "SubmittedDirectory",
    SubmittedDirectorySchema,
  );
