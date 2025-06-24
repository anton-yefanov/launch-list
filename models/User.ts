import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: { type: String },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
