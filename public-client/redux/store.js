import { configureStore } from "@reduxjs/toolkit";
import persistedReducer from "./features/persistedReducer";
import { apiSlice } from "./features/api/apiSlice";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    main: persistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
