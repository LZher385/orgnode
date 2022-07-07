import nodesReducer from "./nodeSlice";
import {
  listNodes,
  addNode,
  editListTitle,
  editListDescription,
  editListScheduledDate,
  editListDeadlineDate,
  deleteList,
  INode,
} from "./nodeSlice";
import globalReducer from "./globalSlice";
import { setEditState, EditStates } from "./globalSlice";

export {
  nodesReducer,
  listNodes,
  addNode,
  editListTitle,
  editListDescription,
  editListScheduledDate,
  editListDeadlineDate,
  deleteList,
  globalReducer,
  setEditState,
  EditStates,
};
export type { INode };
