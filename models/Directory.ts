import mongoose from "mongoose";
import { generateSlug } from "@/utils/generateSlug";

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

export type IDirectory = {
  _id: string;
  name: string;
  description: string;
  url: string;
  slug: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: DirectoryTag[];
  submitDifficulty: SubmitDifficulty;

  // New SEO fields
  seoTitle: string;
  seoDescription: string;
  h1: string;
  about: string;

  createdAt?: Date;
  updatedAt?: Date;
};

const DirectorySchema = new mongoose.Schema<IDirectory>(
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
    slug: {
      type: String,
      required: [true, "Slug is required"],
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

    // New SEO fields
    seoTitle: {
      type: String,
      required: false, // Will be required after migration
      trim: true,
      maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    seoDescription: {
      type: String,
      required: false, // Will be required after migration
      trim: true,
      maxlength: [160, "SEO description cannot exceed 160 characters"],
    },
    h1: {
      type: String,
      required: false, // Will be required after migration
      trim: true,
      maxlength: [100, "H1 cannot exceed 100 characters"],
    },
    about: {
      type: String,
      required: false, // Will be required after migration
      trim: true,
      maxlength: [1000, "About cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    collection: "directories",
  },
);

// Auto-generate slug from name before saving (for new documents)
DirectorySchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    if (!this.slug) {
      const baseSlug = generateSlug(this.name);
      let slug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness
      while (true) {
        const existingDirectory = await mongoose.models.Directory.findOne({
          slug,
          _id: { $ne: this._id },
        });

        if (!existingDirectory) {
          this.slug = slug;
          break;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
  }
  next();
});

DirectorySchema.index({ name: 1 });
DirectorySchema.index({ domainRating: -1 });
DirectorySchema.index({ viewsPerMonth: -1 });
DirectorySchema.index({ tags: 1 });
DirectorySchema.index({ submitDifficulty: 1 });

export default mongoose.models.Directory ||
  mongoose.model<IDirectory>("Directory", DirectorySchema);
