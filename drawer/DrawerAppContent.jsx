import React, { useState, useEffect } from "react";
import { StyleSheet, Image, View, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import { Divider } from "react-native-elements";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Button } from "react-native-paper";
//CONTANTS
import {
  MyTheme,
  imageUploadUrl,
  familyURL,
  userImageUrl,
} from "../utils/constants";

const windowWidth = Dimensions.get("window").width;

const DrawerAppContent = (props) => {
  const isLogged = useSelector((state) => state.userAndSiteReducer.isLogged);
  const currUser = useSelector((state) => state.userAndSiteReducer.currUser);
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [greet, setGreeting] = useState("שלום");

  const btnSetImage = async () => {
    if (!isLogged) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      const temp = await imageUpload(
        result.uri,
        `profilePic${currUser.FamilyCode}.jpg`
      );
      _handleUpdate(temp);
    }
  };

  const imageUpload = async (imgUri, picName) => {
    let imageUri = null;

    let dataI = new FormData();
    dataI.append("picture", {
      uri: imgUri,
      name: picName,
      type: "image/jpg",
    });
    const config = {
      method: "POST",
      body: dataI,
    };

    await fetch(imageUploadUrl, config)
      .then((res) => {
        console.log("res=", JSON.stringify(res));
        if (res.status == 201) {
          return res.json();
        } else {
          console.log("error uploding with status=", res.status);
          return "err";
        }
      })
      .then((responseData) => {
        if (responseData != "err") {
          let picNameWOExt = picName.substring(0, picName.indexOf("."));
          let imageNameWithGUID = responseData.substring(
            responseData.indexOf(picNameWOExt),
            responseData.indexOf(".jpg") + 4
          );
          setImage(userImageUrl + imageNameWithGUID);
          imageUri = userImageUrl + imageNameWithGUID;
          console.log("img uploaded successfully!");
        } else {
          console.log("error uploding ...");
          alert("error uploding ...");
        }
      })
      .catch((err) => {
        alert("err upload= " + err);
      });
    return imageUri;
  };

  //handle update family details to add image
  const _handleUpdate = async (uriString) => {
    const req = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...currUser,
        FamilyImage: uriString,
      }),
    };
    await fetch(familyURL + `?id=${currUser.FamilyCode}`, req)
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then(async (data) => {
        if (data !== "NotFound" && data !== "BadRequest") {
          setImage(data.FamilyImage);
          dispatch(ACTIONS.loginAction(data));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  //check if user have profile image
  const hasProfileImage = () => {
    return image !== null && image !== "";
  };

  //Set the appropriate greeting for the user according to the current time
  const _handleSetGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 5) setGreeting("לילה טוב");
    else if (hour >= 6 && hour <= 12) setGreeting("בוקר טוב");
    else if (hour >= 13 && hour <= 16) setGreeting("צהריים טובים");
    else if (hour >= 17 && hour <= 19) setGreeting("אחרי צהריים טובים");
    else setGreeting("ערב טוב");
  };

  useEffect(() => {
    if (currUser.FamilyImage) setImage(currUser.FamilyImage);
    else setImage(null);
    _handleSetGreeting();
  });

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => {
                btnSetImage();
              }}
            >
              <Image
                source={
                  hasProfileImage()
                    ? { uri: image }
                    : require("../assets/male-avatar-photographer.png")
                }
                style={
                  hasProfileImage()
                    ? styles.profileImage
                    : styles.emptyProfileImage
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {`${greet} , ${currUser.ManagerName}`}
          </Text>
          <Text style={styles.userName}>{currUser.Email}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Divider style={styles.divider} />
        </View>
        <DrawerItemList {...props} />
        {isLogged && (
          <View style={styles.logoutBtn}>
            <Button
              icon="logout"
              color={MyTheme.colors.buttonBackgroundColor}
              mode="contained"
              onPress={() => {
                setImage(null);
                dispatch(ACTIONS.logoutAction());
              }}
            >
              התנתק
            </Button>
          </View>
        )}
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyTheme.colors.drawerBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    marginTop: 20,
    width: windowWidth / 4,
    height: windowWidth / 4,
    borderRadius: 20,
    borderColor: MyTheme.colors.drawerTextColor,
    borderWidth: 1,
  },
  emptyProfileImage: {
    marginTop: 20,
    width: windowWidth / 4,
    height: windowWidth / 4,
  },
  imageContainer: { paddingBottom: 10 },
  userName: {
    fontWeight: "bold",
    color: MyTheme.colors.drawerTextColor,
  },
  divider: {
    marginVertical: 10,
    height: 5,
    backgroundColor: MyTheme.colors.headerBackground,
    borderRadius: 50,
    width: windowWidth / 2,
    borderColor: MyTheme.colors.drawerTextColor,
    borderWidth: 0.2,
  },
  logoutBtn: {
    width: windowWidth / 4,
    marginLeft: windowWidth / 16,
    marginTop: 30,
  },
});

export default DrawerAppContent;
