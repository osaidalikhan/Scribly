import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import UserState from "./context/UserState";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <UserState>
          <App />
        </UserState>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
