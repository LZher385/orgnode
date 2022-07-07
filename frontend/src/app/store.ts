import { configureStore } from "@reduxjs/toolkit";
import { globalReducer, nodesReducer } from "../features";

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
