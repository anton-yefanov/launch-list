import mongoose, { Schema, InferSchemaType } from "mongoose";

export enum DirectoryTag {
  FreeLaunch = "FREE_LAUNCH",
  PaidFeatures = "PAID_FEATURES",
  HighTraffic = "HIGH_TRAFFIC",
  AI = "AI",
  SmallStartups = "SMALL_STARTUPS",
}

export enum SubmitDifficulty {
  High = "High",
  Ok = "Ok",
  Low = "Low",
}

const DirectorySchema: Schema = new Schema(
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
    bgColor: {
      type: String,
      required: [true, "Background color is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: "Please enter a valid hex color code",
      },
    },
    domainRating: {
      type: Number,
      required: [true, "Domain rating is required"],
      min: [0, "Domain rating must be at least 0"],
      max: [100, "Domain rating cannot exceed 100"],
    },
    viewsPerMonth: {
      type: Number,
      required: [true, "Views per month is required"],
      min: [0, "Views per month must be at least 0"],
    },
    tags: [
      {
        type: String,
        enum: Object.values(DirectoryTag),
        required: true,
      },
    ],
    submitDifficulty: {
      type: String,
      enum: Object.values(SubmitDifficulty),
      required: [true, "Submit difficulty is required"],
    },
  },
  {
    timestamps: true,
    collection: "directories",
  },
);

export type IDirectory = InferSchemaType<typeof DirectorySchema>;

DirectorySchema.index({ name: 1 });
DirectorySchema.index({ domainRating: -1 });
DirectorySchema.index({ viewsPerMonth: -1 });
DirectorySchema.index({ tags: 1 });
DirectorySchema.index({ submitDifficulty: 1 });

export default mongoose.models.Directory ||
  mongoose.model<IDirectory>("Directory", DirectorySchema);
