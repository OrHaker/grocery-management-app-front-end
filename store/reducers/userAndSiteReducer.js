import * as ACTION_TYPES from "../actions/action_types";

//default state
const initialState = {
  isLogged: false,
  currUser: {
    FamilyCode: 0,
    FamilyName: "",
    Email: "",
    Password: "",
    ManagerName: "אורח",
    FamilyImage: "",
    Token: "",
  },
  siteName: "Grocery Management",
  familyEmailTaken: false,
};

const userAndSiteReducer = (state = initialState, action) => {
  switch (action.type) {
    //LOG_IN
    case ACTION_TYPES.LOG_IN:
      return { ...state, isLogged: true, currUser: action.payload };
    //LOG_OUT
    case ACTION_TYPES.LOG_OUT:
      return { ...state, isLogged: false, currUser: initialState.currUser };
    //UPDATE_FAMILY_DETAILS
    case ACTION_TYPES.UPDATE_FAMILY_DETAILS:
      if (action.payload !== null)
        return { ...state, currUser: action.payload };
      else return { ...state };
    //FAMILY_REGISTRATION
    case ACTION_TYPES.FAMILY_REGISTRATION:
      if (action.payload === "already exists.")
        return { ...state, familyEmailTaken: true, isLogged: false };
      else if (action.payload !== "BadRequest")
        return {
          ...state,
          familyEmailTaken: false,
          currUser: action.payload,
          isLogged: true,
        };
      return { ...state };
    default:
      return { ...state };
  }
};

export default userAndSiteReducer;
