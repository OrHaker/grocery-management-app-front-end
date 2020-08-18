import React from "react";
import { Appbar } from "react-native-paper";
import { MyTheme } from "../utils/constants";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useIsDrawerOpen } from "@react-navigation/drawer";

//main top header
const AppHeader = ({ subTitle, screenName }) => {
  const isDrawerOpen = useIsDrawerOpen();
  const [isOpen, setIsOpen] = React.useState(isDrawerOpen);

  const localTheme = {
    colors: {
      primary: MyTheme.colors.headerBackground,
    },
  };

  React.useEffect(() => {
    setIsOpen(isDrawerOpen);
  }, [isDrawerOpen]);
  const navigation = useNavigation();

  return (
    <Appbar.Header theme={localTheme} style={{ zIndex: 5 }}>
      <Appbar.Content
        title={screenName}
        subtitle={subTitle}
        color={MyTheme.colors.headerText}
      />
      <Appbar.Action
        icon={isOpen ? "close" : "menu"}
        color={MyTheme.colors.headerText}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </Appbar.Header>
  );
};

export default AppHeader;
