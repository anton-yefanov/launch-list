import * as mongoose from "mongoose";
import { InferSchemaType } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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

export type IUser = InferSchemaType<typeof UserSchema>;

UserSchema.index({ email: 1 });
UserSchema.index({ twitterUsername: 1 });
UserSchema.index({ launchList: 1 });
UserSchema.index({ launchedDirectories: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
