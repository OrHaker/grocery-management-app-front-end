import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { Image, Dimensions, ScrollView, Animated, Easing } from "react-native";
//REDUX
import { useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { Button } from "react-native-paper";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { MyTheme, familyURL } from "../utils/constants";

const windowWidth = Dimensions.get("window").width;

const FamilyRegistration = ({ navigation }) => {
  const dispatch = useDispatch();
  const login = async (family) => await dispatch(ACTIONS.loginAction(family));

  const [family, setFamily] = useState({
    FamilyCode: 0,
    FamilyName: "",
    Email: "",
    Password: "",
    ManagerName: "",
  });
  const [familyEmailTaken, setFamilyEmailTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(true);
  const [spinValue, setSpinValue] = useState(new Animated.Value(0));
  const [editable, setEditable] = React.useState(false);

  const takenEmailMessage = (
    <Text style={{ color: "red" }}>המייל כבר בשימוש..</Text>
  );

  //Family Registration
  const _handleRegistration = async () => {
    for (const key in family) {
      if (family[key] === "") {
        Alert.alert("שדות ריקים", "ישנם שדות ריקים\n נא למלא את כל השדות");
        return;
      } else if (family[key].length > 20) {
        Alert.alert(
          "סליחה",
          "אחד השדות ארוך מידי , \nלא ניתן לעלות על 20 תווים"
        );
        return;
      }
    }
    setIsLoading(true);
    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(family),
    };
    await fetch(familyURL, req)
      .then((res) => {
        if (res.status === 201) return res.json();
        else if (res.status === 409) return "Conflict";
        else return "BadRequest";
      })
      .then(async (data) => {
        if (data !== "Conflict" && data !== "BadRequest") {
          await login(data);
          navigation.navigate("ProductsList");
        }
        if (data === "Conflict") {
          setFamilyEmailTaken(true);
        }
        if (data === "BadRequest") Alert.alert("✋", "סליחה אבל משהו השתבש");
      });
    setIsLoading(false);
  };

  //toggle password visionality
  const _togglePassVision = () => {
    setPassVisible(!passVisible);
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
      })
    ).start();
  };
  React.useEffect(() => {
    startAnimation();
    //this setTimeout solve xiaomi problem to write an email on text input in react native
    setTimeout(() => {
      setEditable(true);
    }, 100);
  }, []);

  return (
    <React.Fragment>
      <Header screenName="הרשמה" />
      {/* <Text>{JSON.stringify(family)}</Text> */}
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.alignCenter}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: spinValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            >
              <Image
                source={require("../assets/icon.png")}
                style={styles.image}
              />
            </Animated.View>
            {/*Email*/}
            <Input
              inputStyle={styles.input}
              editable={editable}
              inputContainerStyle={styles.inputBorder}
              placeholder="אימייל..."
              onChangeText={(Email) => setFamily({ ...family, Email })}
              leftIcon={{
                type: "font-awesome-5",
                name: "envelope-open-text",
                color: MyTheme.colors.inputText,
              }}
            />
            {familyEmailTaken && takenEmailMessage}
            {/*familyName*/}
            <Input
              inputStyle={styles.input}
              inputContainerStyle={styles.inputBorder}
              placeholder="שם משפחה..."
              onChangeText={(FamilyName) =>
                setFamily({ ...family, FamilyName })
              }
              leftIcon={{
                type: "font-awesome-5",
                name: "users",
                color: MyTheme.colors.inputText,
              }}
            />
            {/*managerName*/}
            <Input
              inputStyle={styles.input}
              inputContainerStyle={styles.inputBorder}
              placeholder="שם פרטי מנהל..."
              onChangeText={(ManagerName) =>
                setFamily({ ...family, ManagerName })
              }
              leftIcon={{
                type: "font-awesome-5",
                name: "users",
                color: MyTheme.colors.inputText,
              }}
            />
            {/*Password*/}
            <Input
              inputStyle={styles.input}
              inputContainerStyle={styles.inputBorder}
              secureTextEntry={passVisible}
              placeholder="...סיסמא"
              onChangeText={(Password) => setFamily({ ...family, Password })}
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
              icon="account-plus"
              color={MyTheme.colors.buttonBackgroundColor}
              mode="contained"
              onPress={() => _handleRegistration()}
            >
              הירשם
            </Button>
          </View>
        </ScrollView>
      </View>
      {/* LOADING SPINNER MODAL  */}
      <LoadingSpinner isLoading={isLoading} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyTheme.colors.registerBackgroundColor,
    justifyContent: "center",
  },
  image: {
    height: windowWidth / 2 - 1,
    width: windowWidth / 2,
  },
  alignCenter: {
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 10,
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
});

export default FamilyRegistration;
