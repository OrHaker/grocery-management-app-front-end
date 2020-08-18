import React from "react";
import { Entypo, Foundation } from "@expo/vector-icons";

//fetch urls
export const categoriesURL = `http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site02/GroceryManagement/api/Categories`;
export const familyURL = `http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site02/GroceryManagement/api/Family`;
export const notesURL = `http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site02/GroceryManagement/api/Note`;
export const itemsURL = `http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site02/GroceryManagement/api/Item`;
export const imageUploadUrl = `http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site02/uploadpicture`;
//user image start path from the server
export const userImageUrl = `http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site02/uploadFiles/`;

//app theme colors
export const MyTheme = {
  colors: {
    primary: "#2a9d8f",
    background: "rgb(220, 220, 220)",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(199, 199, 204)",
    drawerBackground: "#333333",
    drawerTextBackColor: "#F4F7F5",
    drawerTextColor: "#fff",
    loginBackgroundColor: "#14213d",
    registerBackgroundColor: "#14213d",
    inputBorder: "#000",
    inputText: "#ccc",
    darkBorder: "#000",
    lightBorder: "#555",
    buttonBackgroundColor: "#264653",
    buttonTextColor: "#f1faee",
    headerBackground: "#264653",
    headerText: "#e76f51",
    addProductBackground: "#cdcdcd",
    productsListBackground: "#293241",
    productsListIconsColor: "#E5E5E5",
    productsListTextColor: "#F4F7F5",
    productsListBordersColor: "#cdcdcd",
    productListInputBorder: "#fff",
    noteItemBorderColor: "#fff",
    notesBackgroundColor: "#293241",
    noteItemTextColor: "#fff",
    editDataBackgroundColor: "#fff",
    snackBarundoText: "red",
    snackBarBackground: "#F4F7F5",
    pickerBackgroundColor: "#264653",
  },
};

export const editFamilyOptions = {
  title: "ערוך פרטי משתמש",
  drawerIcon: ({ size }) => (
    <Entypo name="users" size={size} color={MyTheme.colors.drawerTextColor} />
  ),
};

export const loginOptions = {
  title: "התחבר",
  drawerIcon: ({ size }) => (
    <Entypo name="login" size={size} color={MyTheme.colors.drawerTextColor} />
  ),
};

export const registerOptions = {
  title: "הרשמה",
  drawerIcon: ({ size }) => (
    <Entypo
      name="creative-commons-attribution"
      size={size}
      color={MyTheme.colors.drawerTextColor}
    />
  ),
};

export const productsListOptions = {
  title: "רשימת מוצרים",
  drawerIcon: ({ size }) => (
    <Entypo name="list" size={size} color={MyTheme.colors.drawerTextColor} />
  ),
};

export const notesOptions = {
  title: "הפתקים שלי",
  drawerIcon: ({ size }) => (
    <Foundation
      name="clipboard-notes"
      size={24}
      color={MyTheme.colors.drawerTextColor}
    />
  ),
};

export const mapsOptions = {
  title: "מפות - סופרים בסביבה שלי",
  drawerIcon: () => (
    <Foundation name="map" size={24} color={MyTheme.colors.drawerTextColor} />
  ),
};
