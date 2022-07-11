import { ConstructionOutlined } from "@mui/icons-material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nodesReducer } from ".";

export interface INode {
  _id: string;
  title: string;
  description?: string;
  children: INode[];
  parentId?: string;
  prevSibId?: string;
  nextSibId?: string;
  scheduledDate?: Date;
  deadlineDate?: Date;
  isRoot: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NodeState {
  value: INode[];
}

function dummyChild(id: string, parentId?: string, prevId?: string, nextId?: string): INode {
  return {
    _id: "node" + id,
    title: "y bully me",
    description: "pls",
    children: [],
    parentId: parentId,
    prevSibId: prevId,
    nextSibId: nextId,
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
      children: [dummyChild("3", "node1", undefined, "node4"), dummyChild("4", "node1", "node3", "node5"), dummyChild("5", "node1", "node4", undefined)],
      scheduledDate: undefined,
      deadlineDate: undefined,
      isRoot: true,
      createdAt: undefined,
      updatedAt: undefined,
    },
    {
      _id: "node2",
      title: "Root Node 2",
      description: "This is root node 2",
      children: [],
      scheduledDate: undefined,
      deadlineDate: undefined,
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
    listNodes: (state) => {
      return state;
    },
    addNode: (state) => {
      state.value.push(dummyChild("8"));
    },
    editListTitle: (
      state,
      action: PayloadAction<{ _id: string; title: string }>
    ) => {
      state.value.forEach((node) => {
        if (node._id === action.payload._id) {
          node.title = action.payload.title;
        }
      });
    },
    editListDescription: (
      state,
      action: PayloadAction<{ _id: string; desc: string }>
    ) => {
      state.value.forEach((node) => {
        if (node._id === action.payload._id) {
          node.description = action.payload.desc;
        }
      });
    },
    editListScheduledDate: (
      state,
      action: PayloadAction<{ _id: string; date: Date }>
    ) => {
      state.value.forEach((node) => {
        if (node._id === action.payload._id) {
          node.scheduledDate = action.payload.date;
        }
      });
    },
    editListDeadlineDate: (
      state,
      action: PayloadAction<{ _id: string; date: Date }>
    ) => {
      state.value.forEach((node) => {
        if (node._id === action.payload._id) {
          node.deadlineDate = action.payload.date;
        }
      });
    },
    deleteList: (state, action: PayloadAction<string>) => {
      // update siblings
      state.value = state.value.filter((list) => list._id !== action.payload);
    },
    refileList: () => {},
  },
});

export const {
  listNodes,
  addNode,
  editListTitle,
  editListDescription,
  editListScheduledDate,
  editListDeadlineDate,
  deleteList,
} = nodeSlice.actions;

export default nodeSlice.reducer;
