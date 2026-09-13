import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { persistStore } from "redux-persist";
import authReducer from "./reducers/authSlice";
const rootReducer = combineReducers({
  authReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authReducer"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  // middleware: [thunk],
});

const persistor = persistStore(store);
export { store, persistor };
