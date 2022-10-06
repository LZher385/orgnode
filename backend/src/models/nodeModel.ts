import mongoose, { Schema } from "mongoose";
import INode from "../types/node";

const NodeSchema: Schema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    scheduledDate: { type: Date },
    deadlineDate: { type: Date },
    isRoot: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

NodeSchema.add({
  children: [NodeSchema],
});

export default mongoose.model<INode>("Node", NodeSchema);
