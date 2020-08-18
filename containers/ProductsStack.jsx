import React from "react";
import { connect } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
import { createStackNavigator } from "@react-navigation/stack";
import EditProductPage from "./EditProductPage";
import MainProductsPage from "./MainProductsPage";

const Stack = createStackNavigator();

const ProductsStack = () => {
  return (
    <>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="MainProducts" component={MainProductsPage} />
        <Stack.Screen name="EditProduct" component={EditProductPage} />
      </Stack.Navigator>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isLogged: state.userAndSiteReducer.isLogged,
    currUser: state.userAndSiteReducer.currUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: async (email, password) => {
      await dispatch(ACTIONS.loginAction(email, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsStack);
