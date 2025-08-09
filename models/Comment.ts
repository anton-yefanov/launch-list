import * as mongoose from "mongoose";

export interface IComment {
  _id: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  startup: mongoose.Schema.Types.ObjectId;
  parentComment?: mongoose.Schema.Types.ObjectId;
  upvoters: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    upvoters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ startup: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ author: 1 });

export const Comment = 
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
