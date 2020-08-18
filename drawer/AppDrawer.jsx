import React from "react";
//REDUX
import { useSelector } from "react-redux";
//DRAWER UTILS
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import DrawerAppContent from "./DrawerAppContent";
//SCREENS
import * as Screens from "../screens";
//CONSTANTS
import * as constants from "../utils/constants";

const Drawer = createDrawerNavigator();

const AppDrawer = (props) => {
  const isLogged = useSelector((state) => state.userAndSiteReducer.isLogged);
  const localTheme = {
    colors: {
      primary: constants.MyTheme.colors.drawerTextBackColor,
      text: constants.MyTheme.colors.drawerTextColor,
    },
  };

  const loggedInScreens = (
    <>
      <Drawer.Screen
        name="ProductsList"
        component={Screens.ProductsStack}
        options={constants.productsListOptions}
      />
      <Drawer.Screen
        name="Notes"
        component={Screens.NotesStack}
        options={constants.notesOptions}
      />
      <Drawer.Screen
        name="Map"
        component={Screens.MapPage}
        options={constants.mapsOptions}
      />
      <Drawer.Screen
        name="EditFamilyDetails"
        component={Screens.EditFamilyDetailsPage}
        options={constants.editFamilyOptions}
      />
    </>
  );

  const defaultScreens = (
    <>
      <Drawer.Screen
        name="Login"
        component={Screens.LoginPage}
        options={constants.loginOptions}
      />
      <Drawer.Screen
        name="FamilyRegistration"
        component={Screens.FamilyRegistrationPage}
        options={constants.registerOptions}
      />
    </>
  );

  return (
    <NavigationContainer theme={localTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerAppContent {...props} />}
      >
        {isLogged ? loggedInScreens : defaultScreens}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppDrawer;
