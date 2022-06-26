import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nodesReducer } from ".";

export interface INode {
  _id: string;
  title: string;
  description?: string;
  children?: INode[];
  scheduledDate?: Date;
  deadlineDate?: Date;
  isRoot: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NodeState {
  value: INode[];
}

function dummyChild(id: string): INode {
  return {
    _id: "node" + id,
    title: "y bully me",
    description: "pls",
    children: undefined,
    scheduledDate: undefined,
    deadlineDate: undefined,
    isRoot: false,
    createdAt: undefined,
    updatedAt: undefined,
  };
}

const initialState: NodeState = {
  value: [
    {
      _id: "node1",
      title: "Root Node 1",
      description: "This is root node 1",
      children: [dummyChild("3"), dummyChild("4")],
      scheduledDate: new Date(),
      deadlineDate: new Date(),
      isRoot: true,
      createdAt: undefined,
      updatedAt: undefined,
    },
    {
      _id: "node2",
      title: "Root Node 2",
      description: "This is root node 2",
      children: undefined,
      scheduledDate: new Date(),
      deadlineDate: new Date(),
      isRoot: true,
      createdAt: undefined,
      updatedAt: undefined,
    },
  ],
};

// {
//     _id: ,
//     title: ,
//     description: ,
//     children: ,
//     scheduledDate: ,
//     deadlineDate: ,
//     isRoot: ,
//     createdAt: ,
//     updatedAt: ,
// }

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    editNodeTitle: (
      state,
      action: PayloadAction<{ _id: string; title: string }>
    ) => {
      return state.value.forEach((node) => {
        if (node._id === action.payload._id) {
          node.title = action.payload.title;
        }
      });
    },
    listNodes: (state) => {
      return state;
    },
    addNode: (state) => {
      state.value.push(dummyChild("8"));
    },
  },
});

export const { editNodeTitle, listNodes, addNode } = nodeSlice.actions;

export default nodeSlice.reducer;
