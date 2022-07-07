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
}

const initialState: IGlobalState = {
  editState: EditStates.None,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setEditState: (state, action: PayloadAction<{ editState: EditStates }>) => {
      state = { ...state, editState: action.payload.editState };
    },
  },
});

export const { setEditState } = globalSlice.actions;

export default globalSlice.reducer;
