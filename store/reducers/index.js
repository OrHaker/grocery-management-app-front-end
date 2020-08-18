import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import userAndSiteReducer from "./userAndSiteReducer";
import itemsAndNotesReducer from "./itemsAndNotesReducer";

//redux global store

const store = createStore(
  combineReducers({
    userAndSiteReducer,
    itemsAndNotesReducer,
  }),
  {},
  applyMiddleware(ReduxThunk)
);

export default store;
