import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { Alert } from "react-native";
import { familyURL } from "./constants";

export default async function registerForPushNotificationsAsync(family) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    Alert.alert(
      "Opps something went wrong...",
      "You must enable push notifications to use all app services."
    );
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }
  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to backend server
  if (token !== family.Token) {
    const req = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...family, Token: token }),
    };
    await fetch(familyURL + `?id=${family.FamilyCode}`, req)
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then(async (data) => {
        console.log("data", data);
        if (data !== "NotFound" && data !== "BadRequest") {
          await props.login(data);
          props.navigation.navigate("ProductsList");
        } else if (data === "NotFound") {
          Alert.alert("Something went wrong...", "User Not Found");
        } else if (data === "BadRequest") {
          Alert.alert("Something went wrong...", "COMMUNICATION PROBLEM");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  return token;
}
