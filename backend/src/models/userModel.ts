import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
