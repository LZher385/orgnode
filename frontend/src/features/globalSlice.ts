import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum EditStates {
  None,
  Title,
  Desc,
  Schedule,
  Deadline,
}

interface IGlobalState {
  editState: EditStates;
  currentId: string;
  openedIds: { [id: string]: boolean };
}

const initialState: IGlobalState = {
  editState: EditStates.None,
  currentId: "",
  openedIds: {},
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setEditState: (state, action: PayloadAction<{ editState: EditStates }>) => {
      state.editState = action.payload.editState;
    },
    setCurrentId: (state, action: PayloadAction<{ currentId: string }>) => {
      state.currentId = action.payload.currentId;
    },
    toggleOpenedId: (state, action: PayloadAction<{ id: string }>) => {
      if (action.payload.id in state.openedIds) {
        delete state.openedIds[action.payload.id];
      } else {
        state.openedIds[action.payload.id] = true;
      }
    },
  },
});

export const { setEditState, setCurrentId, toggleOpenedId } =
  globalSlice.actions;

export default globalSlice.reducer;
