import { Document } from "mongoose";
import { INode } from "./node";

export interface IList {
  name: string;
  children: INode[];
}

export interface ListDocument extends IList, Document {}
