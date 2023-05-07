import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import rootReducer from "./rootSlice";
import collectionReducer from "./collectionSlice";
import { apiSlice } from "./api/apiSlice";

const mainReducer = combineReducers({
  root: rootReducer,
  cart: cartReducer,
  collection: collectionReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default mainReducer;
