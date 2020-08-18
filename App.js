import React from "react";
import store from "./store/reducers/index";
import { Provider } from "react-redux";
import { I18nManager } from "react-native"; //support RTL

import AppDrawer from "./drawer/AppDrawer";

I18nManager.allowRTL(false); //support LTR

export default function App() {
  return (
    <Provider store={store}>
      <AppDrawer />
    </Provider>
  );
}
