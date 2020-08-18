import * as ACTION_TYPES from "./action_types";
import { storeAsyncStorageData } from "../../utils/utilsFuncs";

//FAMILY ACTIONS
//LOG IN
export const loginAction = (currUser) => {
  return async (dispatch) => {
    await storeAsyncStorageData("currUser", currUser);
    await storeAsyncStorageData("isLogged", true);
    return dispatch({
      type: ACTION_TYPES.LOG_IN,
      payload: currUser,
    });
  };
};

//LOG OUT
export const logoutAction = () => {
  return async (dispatch) => {
    await storeAsyncStorageData("currUser", null);
    await storeAsyncStorageData("isLogged", false);
    return dispatch({
      type: ACTION_TYPES.LOG_OUT,
      payload: false,
    });
  };
};

////PRODUCTS
//SET PRODUCTS
export const setItemsAction = (items) => {
  return (dispatch) => {
    return dispatch({
      type: ACTION_TYPES.SET_ITEMS,
      payload: items,
    });
  };
};

//SET CATEGORIES
export const setCategoriesAction = (categories) => {
  return (dispatch) => {
    return dispatch({
      type: ACTION_TYPES.SET_CATEGORIES,
      payload: categories,
    });
  };
};

//UPDATE PRODUCTS
export const updateItemsAction = (items) => {
  return (dispatch) => {
    return dispatch({
      type: ACTION_TYPES.UPDATE_ITEMS,
      payload: items,
    });
  };
};

////NOTES
//SET NOTES
export const setNotesAction = (notes) => {
  return (dispatch) => {
    return dispatch({
      type: ACTION_TYPES.SET_NOTES,
      payload: notes,
    });
  };
};

//UPDATE NOTES
export const updateNotesAction = (notes) => {
  return (dispatch) => {
    return dispatch({
      type: ACTION_TYPES.UPDATE_NOTES,
      payload: notes,
    });
  };
};
