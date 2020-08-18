import React, { useState } from "react";
import { FAB, Portal, Provider } from "react-native-paper";
import { MyTheme } from "../utils/constants";

//uses to make share action
const ShareFAB = ({ shareViaWhatsapp }) => {
  const [open, setOpen] = useState(false);
  const { buttonBackgroundColor } = MyTheme.colors;

  return (
    <Provider>
      <Portal>
        <FAB.Group
          theme={{ colors: { backdrop: "transparent", accent: "#000" } }}
          open={open}
          fabStyle={{ backgroundColor: buttonBackgroundColor }}
          icon={open ? "close" : "share-variant"}
          actions={[
            {
              icon: "whatsapp",
              onPress: () => shareViaWhatsapp(),
              color: MyTheme.colors.buttonBackgroundColor,
            },
          ]}
          onStateChange={() => console.log("FAB state Changed")}
          onPress={() => setOpen(!open)}
        />
      </Portal>
    </Provider>
  );
};

export default ShareFAB;
