import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { ScrollView, Image, Dimensions, Animated } from "react-native";
//REDUX
import { useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { Button } from "react-native-paper";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
//FUNCTIONS
import { retrieveAsyncStorageData } from "../utils/utilsFuncs";
import { MyTheme, familyURL } from "../utils/constants";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const login = async (family) => await dispatch(ACTIONS.loginAction(family));

  const [user, setUser] = useState({ Email: "", Password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(true);
  const [logoAnime, setLogoAnime] = useState(new Animated.Value(0));

  //LOG IN
  const _handlerLogin = async () => {
    if (user.Email === "" || user.Password === "") {
      Alert.alert("שדות ריקים", "✋ ישנם שדות ריקים \n אנא תקן שאת ונסה שנית.");
      return;
    }

    setIsLoading(true);
    const req = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    await fetch(
      familyURL + `?email=${user.Email}&password=${user.Password}`,
      req
    )
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then(async (data) => {
        if (data !== "NotFound" && data !== "BadRequest") {
          await login(data);
          navigation.navigate("ProductsList");
        } else if (data === "NotFound") {
          Alert.alert("✋", "סליחה ,\n שם משתמש או סיסמא לא נכונים");
        } else if (data === "BadRequest") {
          Alert.alert("✋", "סליחה אבל משהו השתבש");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
    setIsLoading(false);
  };

  //toggle password visionality
  const _togglePassVision = () => {
    setPassVisible(!passVisible);
  };

  useEffect(() => {
    async function checkIfLogged() {
      setIsLoading(true);
      const isLogged = await retrieveAsyncStorageData("isLogged");
      const currUser = await retrieveAsyncStorageData("currUser");
      if (currUser === null) {
        setIsLoading(false);
        return;
      }
      if (isLogged) {
        await login(currUser);
        navigation.navigate("ProductsList");
      } else setIsLoading(false);
    }
    checkIfLogged();
    //poping logo animation
    Animated.spring(logoAnime, {
      toValue: 1,
      tension: 10,
      friction: 2,
      duration: 2500,
    }).start();
  }, []);

  return (
    <React.Fragment>
      <Header screenName="התחבר" />
      <ScrollView style={styles.container}>
        <View style={styles.alignCenter}>
          <Animated.View
            style={{
              opacity: logoAnime,
              top: logoAnime.interpolate({
                inputRange: [0, 1],
                outputRange: [150, 0],
              }),
            }}
          >
            <Image
              source={require("../assets/icon.png")}
              style={styles.image}
            />
          </Animated.View>
          {/*Email*/}
          <Input
            inputContainerStyle={styles.inputBorder}
            inputStyle={styles.input}
            placeholderTextColor={MyTheme.colors.lightBorder}
            placeholder=" הכנס אימייל"
            onChangeText={(Email) => setUser({ ...user, Email })}
            leftIcon={{
              type: "font-awesome-5",
              name: "envelope-open-text",
              color: MyTheme.colors.inputText,
            }}
          />
          {/*Password*/}
          <Input
            inputContainerStyle={styles.inputBorder}
            inputStyle={styles.input}
            placeholderTextColor={MyTheme.colors.lightBorder}
            secureTextEntry={passVisible}
            placeholder="הכנס סיסמא"
            onChangeText={(Password) => setUser({ ...user, Password })}
            leftIcon={
              <TouchableOpacity onPress={_togglePassVision}>
                <Icon
                  name={passVisible ? "eye" : "eye-slash"}
                  size={24}
                  color={MyTheme.colors.inputText}
                />
              </TouchableOpacity>
            }
          />
          <Button
            icon="login"
            color={MyTheme.colors.buttonBackgroundColor}
            mode="contained"
            onPress={_handlerLogin}
          >
            התחבר
          </Button>
        </View>
      </ScrollView>
      {/* LOADING SPINNER MODAL  */}
      <LoadingSpinner isLoading={isLoading} />
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  alignCenter: {
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 30,
  },
  container: {
    flex: 1,
    backgroundColor: MyTheme.colors.loginBackgroundColor,
  },
  image: {
    height: windowWidth / 2 - 1,
    width: windowWidth / 2,
    marginBottom: 30,
  },
  input: {
    color: MyTheme.colors.inputText,
    marginTop: 10,
    marginHorizontal: 10,
    textAlign: "right",
  },
  inputBorder: {
    borderBottomColor: MyTheme.colors.inputBorder,
  },
  modal: {
    height: windowHeight,
    width: windowWidth,
  },
});

export default Login;
