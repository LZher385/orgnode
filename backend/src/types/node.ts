import { Document } from "mongoose";

export default interface INode extends Document {
  title: string;
  description?: string;
  childrenIds: string[];
  scheduledDate?: Date;
  deadlineDate?: Date;
  isRoot: boolean;
}
