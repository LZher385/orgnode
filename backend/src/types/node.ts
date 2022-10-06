import { Document } from "mongoose";

export default interface INode extends Document {
  title: string;
  description?: string;
  ancestors: string[];
  parent?: string;
  scheduledDate?: Date;
  deadlineDate?: Date;
  isRoot: boolean;
}
