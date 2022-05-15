export interface INode {
  title: string;
  children: Node[];
  content?: string;
  scheduled?: Date;
  deadline?: Date;
}
