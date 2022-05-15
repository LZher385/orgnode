import { Schema, model, connect } from "mongoose";
import { ListDocument, IList, INode } from "../types";

// const nodeSchema = new Schema({ name: { type: String, required: true } });
var nodeSchema = new Schema<INode>();
nodeSchema.add({
  title: { type: String, required: true },
  children: [nodeSchema],
});
const listSchema = new Schema<IList>({
  name: { type: String, required: true, unique: true },
  children: [nodeSchema],
});

export const List = model<IList>("List", listSchema);
