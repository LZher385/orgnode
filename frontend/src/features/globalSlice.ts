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
  },
});

export const { setEditState } = globalSlice.actions;

export default globalSlice.reducer;
