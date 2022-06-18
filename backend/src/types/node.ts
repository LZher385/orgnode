import { Document } from "mongoose";

export default interface INode extends Document {
  title: string;
  description?: string;
  children: INode[];
  scheduledDate?: Date;
  deadlineDate?: Date;
  isRoot: boolean;
}
