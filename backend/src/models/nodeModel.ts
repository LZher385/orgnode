import mongoose, { Schema } from "mongoose";
import INode from "../types/node";

const NodeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Node" }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Node" },
    scheduledDate: { type: Date },
    deadlineDate: { type: Date },
    isRoot: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

NodeSchema.add({
  children: [NodeSchema],
});

export default mongoose.model<INode>("Node", NodeSchema);
