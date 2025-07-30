import * as mongoose from "mongoose";

export type IUser = {
  role: "REGULAR" | "ADMIN";
  _id: string;
  name: string;
  email: string;
  image?: string;
  startups: mongoose.Schema.Types.ObjectId[];
  twitterUsername?: string;
  launchList: mongoose.Schema.Types.ObjectId[];
  launchedDirectories: mongoose.Schema.Types.ObjectId[];
  submittedDirectories: mongoose.Schema.Types.ObjectId[];
};

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: { type: String },
    startups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup" }],
    twitterUsername: { type: String },
    launchList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Directory",
      },
    ],
    launchedDirectories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Directory",
      },
    ],
    submittedDirectories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubmittedDirectory",
      },
    ],
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ twitterUsername: 1 });
UserSchema.index({ launchList: 1 });
UserSchema.index({ launchedDirectories: 1 });
UserSchema.index({ submittedDirectories: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
