import { configureStore } from "@reduxjs/toolkit";
import { authReducer, contentReducer } from "./utils";
import sidebarReducer from "./slices/sidebarSlice";
export const store = configureStore({
  reducer: {
    contents: contentReducer,
    auths: authReducer,
    sidebar: sidebarReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
