import mongoose from "mongoose";

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  telegraphUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    telegraphUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);
