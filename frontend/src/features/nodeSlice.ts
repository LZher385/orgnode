import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import logging from "../config/logging";

export interface INode {
  _id: string;
  title: string;
  description?: string;
  children: INode[];
  parentId?: string;
  scheduledDate?: Date;
  deadlineDate?: Date;
  isRoot: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function dummyChild(id: string, parentId: string): INode {
  return {
    _id: id,
    title: id,
    description: "pls",
    children: [],
    parentId: parentId,
    scheduledDate: undefined,
    deadlineDate: undefined,
    isRoot: false,
    createdAt: undefined,
    updatedAt: undefined,
  };
}

const dummyData: INode[] = [
  {
    _id: "node1",
    title: "Root Node 1",
    description: "This is root node 1",
    children: [
      dummyChild("node3", "node1"),
      dummyChild("node4", "node1"),
      dummyChild("node5", "node1"),
    ],
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
];

const loadDummyData = () => {
  return dummyData;
};

const loadDummyNode = (listNodeId: string) => {
  // TODO find from state instead
  const listNode = dummyData.find((node) => node._id === listNodeId);
  return flattenNode(listNode!);
};

const flattenNode = (parentNode: INode) => {
  let result: INode[] = [parentNode];
  logging.info(parentNode);
  parentNode.children.forEach((child) => {
    result = result.concat(flattenNode(child));
  });
  return result;
};

const flattenNodeId = (parentNode: INode) => {
  let result: string[] = [parentNode._id];
  parentNode.children.forEach((child) => {
    result = result.concat(flattenNodeId(child));
  });
  return result;
};

const nodesAdapter = createEntityAdapter<INode>({
  selectId: (node) => node._id,
});

export const nodeSlice = createSlice({
  name: "node",
  initialState: nodesAdapter.getInitialState({ value: dummyData }),
  reducers: {
    fetchListNodes: (state) => {
      // const payload = loadDummyData();
      nodesAdapter.addMany(state, state.value);
    },
    fetchNodes: (state, action: PayloadAction<{ id: string }>) => {
      // const payload = loadDummyNode(action.payload.id);
      // nodesAdapter.addMany(state, payload);
      const listNode = state.entities[action.payload.id];
      nodesAdapter.addMany(state, flattenNode(listNode!));
    },
    addNode: (
      state,
      action: PayloadAction<{ parentId?: string; node: INode }>
    ) => {
      if (action.payload.parentId) {
        // not adding a list node
        state.entities[action.payload.parentId]?.children.push(
          action.payload.node
        );
      }
      nodesAdapter.addOne(state, action.payload.node);
    },
    editNodeTitle: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      nodesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          title: action.payload.title,
        },
      });
    },
    editNodeDescription: (
      state,
      action: PayloadAction<{ id: string; desc: string }>
    ) => {
      nodesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          description: action.payload.desc,
        },
      });
    },
    editNodeScheduleDate: (
      state,
      action: PayloadAction<{ id: string; date: Date }>
    ) => {
      logging.info("edit schedule");
      nodesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          scheduledDate: action.payload.date,
        },
      });
    },
    editNodeDeadlineDate: (
      state,
      action: PayloadAction<{ id: string; date: Date }>
    ) => {
      nodesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          deadlineDate: action.payload.date,
        },
      });
    },
    deleteNode: (state, action: PayloadAction<{ id: string }>) => {
      const rootNode = state.entities[action.payload.id];
      try {
        // delete node in the backend
        removeChildFromParent(state, action.payload.id);
        // remove all descendants
        const idArr = flattenNodeId(rootNode!);
        nodesAdapter.removeMany(state, idArr);
      } catch (e) {}
    },
    refileToList: (state, action: PayloadAction<{ idToRefile: string }>) => {
      const nodeId = action.payload.idToRefile;
      try {
        removeChildFromParent(state, nodeId);
        state.entities[nodeId]!.isRoot = true;
      } catch (e) {}
    },
    refileToNode: (
      state,
      action: PayloadAction<{ idToRefile: string; newParentId: string }>
    ) => {
      const { idToRefile, newParentId } = action.payload;
      if (idToRefile === newParentId) {
        throw "Cannot refile to the same element!";
      }
      try {
        removeChildFromParent(state, idToRefile);
        state.entities[idToRefile]!.isRoot = false;
        state.entities[newParentId]?.children.push(state.entities[idToRefile]!);
      } catch (e) {}
    },
  },
});

function removeChildFromParent(state: EntityState<INode>, childId: string) {
  const parentId = state.entities[childId]?.parentId;
  if (parentId) {
    // update children array in parent node
    nodesAdapter.updateOne(state, {
      id: parentId,
      changes: {
        children: state.entities[parentId]!.children.filter(
          (child) => child._id !== childId
        ),
      },
    });
  }
}

export const nodesSelectors = nodesAdapter.getSelectors<RootState>(
  (state) => state.nodes
);

export const {
  fetchListNodes,
  fetchNodes,
  addNode,
  editNodeTitle,
  editNodeDescription,
  editNodeScheduleDate,
  editNodeDeadlineDate,
  deleteNode,
  refileToList,
  refileToNode,
} = nodeSlice.actions;

export default nodeSlice.reducer;
