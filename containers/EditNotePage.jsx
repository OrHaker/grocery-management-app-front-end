import React, { useState, useEffect } from "react";
import { StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Dimensions, Text, View } from "react-native";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import Header from "../components/Header";
import { MyTheme as theme, notesURL } from "../utils/constants";
import { Button } from "react-native-paper";
import { Text as ElementText, Input } from "react-native-elements";
import DatePicker from "@react-native-community/datetimepicker";

const windowWidth = Dimensions.get("window").width;

const EditNotePage = ({ route, navigation }) => {
  const notes = useSelector((state) => state.itemsAndNotesReducer.notes);
  const dispatch = useDispatch();
  const [note, setNote] = useState({
    FamilyCode: 2,
    NoteCode: 2,
    Description: "לקנות סוכר",
    TimeAndDate: "14/6/2020",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const _updateNote = async () => {
    for (const key in note) {
      if (note[key] === "") {
        Alert.alert("✋", `סליחה אבל משהו השתבש ${key} השדה ריק`);
        return;
      }
    }
    const reqBody = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(note),
    };
    let temp = null;
    await fetch(notesURL + `?id=${note.NoteCode}`, reqBody)
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "NotFound" && data !== "BadRequest") {
          temp = notes;
          temp = temp.map((i) => {
            if (i.NoteCode === data.NoteCode) return data;
            else return i;
          });
        } else {
          Alert.alert("✋", "סליחה אבל משהו השתבש");
        }
      });
    if (temp !== null) {
      dispatch(ACTIONS.updateNotesAction(temp));
      navigation.navigate("MainNotes");
    }
  };

  useEffect(() => {
    setNote(route.params.note);
  }, []);

  const _calcAndSetDate = (d) => {
    d = d.toLocaleDateString("en-GB").split("/");
    const temp = parseInt(d[1]);
    d[1] = parseInt(d[0]);
    d[0] = temp;
    d = d.join("/");
    setNote({ ...note, TimeAndDate: d });
    return d;
  };

  return (
    <React.Fragment>
      <Header screenName="עריכת פתק" />
      <ImageBackground
        source={require("../assets/paperbackground.jpg")}
        style={styles.container}
      >
        <View style={styles.permanentContainer}>
          <ElementText h4 h4Style={styles.h4}>
            תיאור
          </ElementText>
          <Input
            value={note.Description}
            placeholder="הכנס תיאור"
            onChangeText={(Description) => setNote({ ...note, Description })}
            leftIcon={{ type: "font-awesome-5", name: "file-alt" }}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={{ fontSize: 20 }}>
              {note.TimeAndDate ? note.TimeAndDate : "בחר תאריך לתזכורת"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DatePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, value) => {
                setShowDatePicker(false);
                _calcAndSetDate(value);
              }}
              minimumDate={new Date(2020, 1, 1)}
            />
          )}
          <Button
            icon="autorenew"
            color={theme.colors.buttonBackgroundColor}
            mode="contained"
            onPress={_updateNote}
          >
            עדכן
          </Button>
        </View>
      </ImageBackground>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.notesBackgroundColor,
  },
  input: {
    height: 30,
    fontSize: 20,
    borderColor: "transparent",
    borderBottomColor: theme.colors.inputBorder,
    borderWidth: 1,
    width: windowWidth - 100,
    marginVertical: 30,
  },
  h4: {
    color: theme.colors.headerBackground,
  },
  permanentContainer: {
    backgroundColor: "rgba(51,51,51,0.3)",
    alignItems: "center",
    paddingBottom: 30,
    borderRadius: 50,
    width: windowWidth - 100,
    height: windowWidth,
  },
});

export default EditNotePage;
