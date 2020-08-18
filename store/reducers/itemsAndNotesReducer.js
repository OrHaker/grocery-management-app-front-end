import * as ACTION_TYPES from "../actions/action_types";

//default state
const initState = {
  notes: [],
  items: [],
  categories: [],
};
const itemsAndNotesReducer = (state = initState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ITEMS:
      return { ...state, items: action.payload };
    case ACTION_TYPES.UPDATE_ITEMS:
      return { ...state, items: action.payload };
    case ACTION_TYPES.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case ACTION_TYPES.SET_NOTES:
      return { ...state, notes: action.payload };
    case ACTION_TYPES.UPDATE_NOTES:
      return { ...state, notes: action.payload };
    default:
      return state;
  }
};

export default itemsAndNotesReducer;
