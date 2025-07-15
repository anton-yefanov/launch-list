import * as mongoose from "mongoose";

export type IUser = {
  role: "REGULAR" | "ADMIN";
  _id: string;
  name: string;
  email: string;
  image?: string;
  startups: string[];
  twitterUsername?: string;
  launchList: string[];
  launchedDirectories: string[];
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
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ twitterUsername: 1 });
UserSchema.index({ launchList: 1 });
UserSchema.index({ launchedDirectories: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
