import React, { useState } from "react";
import { StyleSheet, Alert, View, Text, TouchableOpacity } from "react-native";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { Button } from "react-native-paper";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { MyTheme, familyURL } from "../utils/constants";

const EditFamilyDetails = ({ navigation }) => {
  const currUser = useSelector((state) => state.userAndSiteReducer.currUser);
  const dispatch = useDispatch();

  const login = async (family) => await dispatch(ACTIONS.loginAction(family));

  const { FamilyCode, FamilyName, Email, Password } = currUser;
  const { ManagerName, Token, FamilyImage } = currUser;

  const [family, setFamily] = useState({
    FamilyCode,
    FamilyName,
    Email,
    Password,
    ManagerName,
    Token,
    FamilyImage,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(false);

  //handle edit family details
  const _handleUpdate = async () => {
    //search for empty values in familyuser object
    for (const property in family) {
      if (property === "Image" || property === "Token") continue;
      if (family[property] === "") {
        Alert.alert("שדות ריקים✋", "ישנם שדות ריקים \n אנא תקן ונסה שנית.");
        return;
      }
    }
    setIsLoading(true);
    const req = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(family),
    };
    await fetch(familyURL + `?id=${family.FamilyCode}`, req)
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then(async (data) => {
        console.log("_handleUpdate in EditFamilyDetailsPage data", data);
        if (data !== "NotFound" && data !== "BadRequest") {
          await login(data);
          navigation.navigate("ProductsList");
        } else if (data === "NotFound") {
          Alert.alert("✋", "סליחה אבל משהו השתבש");
        } else if (data === "BadRequest") {
          Alert.alert("✋", "סליחה אבל משהו השתבש");
        }
      })
      .catch((err) => {
        console.log("_handleUpdate in EditFamilyDetailsPage error", err);
      });
    setIsLoading(false);
  };

  //toggle password visionality
  const _togglePassVision = () => {
    setPassVisible(!passVisible);
  };

  return (
    <React.Fragment>
      <Header screenName="עריכת פרטי משתמש" />
      <View style={styles.container}>
        {/*Email*/}
        <Text
          onPress={() => Alert.alert("לא ניתן לשנות את האימייל לאחר ההרשמה")}
          style={[styles.descriptionText, styles.email]}
        >
          {family.Email}
        </Text>
        {/*familyName*/}
        <Text style={styles.descriptionText}>שם משפחה</Text>
        <Input
          inputContainerStyle={styles.inputBorder}
          inputStyle={styles.input}
          value={family.FamilyName}
          placeholder="שם משפחה ..."
          onChangeText={(FamilyName) => setFamily({ ...family, FamilyName })}
        />
        {/*managerName*/}
        <Text style={styles.descriptionText}>שם המנהל</Text>
        <Input
          inputContainerStyle={styles.inputBorder}
          inputStyle={styles.input}
          value={family.ManagerName}
          placeholder="שם פרטי של המנהל..."
          onChangeText={(ManagerName) => setFamily({ ...family, ManagerName })}
        />
        {/*Password*/}
        <Text style={styles.descriptionText}>סיסמא</Text>
        <Input
          inputContainerStyle={styles.inputBorder}
          inputStyle={styles.input}
          value={family.Password}
          secureTextEntry={passVisible}
          placeholder="סיסמא..."
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
          icon="reload"
          color={MyTheme.colors.buttonBackgroundColor}
          mode="contained"
          onPress={_handleUpdate}
        >
          עדכן
        </Button>
        {/* LOADING SPINNER MODAL  */}
        <LoadingSpinner isLoading={isLoading} />
      </View>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MyTheme.colors.loginBackgroundColor,
  },
  descriptionText: {
    color: MyTheme.colors.headerText,
    alignSelf: "flex-end",
    marginHorizontal: 15,
  },
  email: {
    alignSelf: "center",
    fontSize: 20,
    color: MyTheme.colors.inputText,
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

export default EditFamilyDetails;
