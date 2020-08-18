import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainNotesPage from "./MainNotesPage";
import EditNotePage from "./EditNotePage";

const Stack = createStackNavigator();

const NotesStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MainNotes" component={MainNotesPage} />
      <Stack.Screen name="EditNote" component={EditNotePage} />
    </Stack.Navigator>
  );
};

export default NotesStack;
