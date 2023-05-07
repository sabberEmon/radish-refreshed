import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import mainReducer from "./mainReducer";

const persistConfig = {
  key: "main",
  storage,
  whitelist: ["cart"],
};

const persistedReducer = persistReducer(persistConfig, mainReducer);

export default persistedReducer;
