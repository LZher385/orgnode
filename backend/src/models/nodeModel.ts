import mongoose, { Schema } from "mongoose";
import INode from "../types/node";

const NodeSchema: Schema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    children: { type: [this] },
    scheduledDate: { type: Date },
    deadlineDate: { type: Date },
    isRoot: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INode>("Node", NodeSchema);
