import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Dimensions } from "react-native";
import { KeyboardAvoidingView, Alert, TouchableOpacity } from "react-native";
import { MyTheme as theme } from "./../utils/constants";
import { Button } from "react-native-paper";
import { Text as ElementText } from "react-native-elements";
import DatePicker from "@react-native-community/datetimepicker";

const windowWidth = Dimensions.get("window").width;

//add note bottom form
export default function AddProductForm({ setIsFetching, addNote, familyCode }) {
  const [note, setNote] = useState({
    FamilyCode: familyCode,
    NoteCode: 2,
    Description: "",
    TimeAndDate: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  //calc current user location date
  const _calcAndSetDate = (d) => {
    if (!d) return;
    d = d.toLocaleDateString("en-GB").split("/");
    const temp = parseInt(d[1]);
    d[1] = parseInt(d[0]);
    d[0] = temp;
    d = d.join("/");
    setNote({ ...note, TimeAndDate: d });
    return d;
  };

  const _addNote = async () => {
    for (const property in note)
      if (!note[property]) {
        Alert.alert(
          "🤔 שדות ריקים",
          "ישנם שדות ריקים\n אנא מלא אותם ונסה שנית."
        );
        return;
      }
    setIsFetching(true);
    addNote(note);
    setNote({
      FamilyCode: familyCode,
      NoteCode: 2,
      Description: "",
      TimeAndDate: "",
    });
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.permanentContainer}>
        <ElementText h4 h4Style={styles.h4}>
          הוספת פתק חדש
        </ElementText>
        <Text style={styles.dateText}>תיאור הפתק</Text>
        <TextInput
          placeholder="תיאור"
          style={styles.input}
          onChangeText={(Description) => setNote({ ...note, Description })}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {note.TimeAndDate ? note.TimeAndDate : "בחר תאריך לתזכורת"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DatePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            display="default"
            textColor={theme.colors.noteItemTextColor}
            onChange={(event, value) => {
              setShowDatePicker(false);
              _calcAndSetDate(value);
            }}
            minimumDate={new Date(2020, 1, 1)}
          />
        )}
        <Button
          icon="plus"
          color={theme.colors.buttonBackgroundColor}
          mode="contained"
          onPress={_addNote}
          style={{ marginTop: 10 }}
        >
          הוסף
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    backgroundColor: "transparent",
  },
  input: {
    height: 30,
    fontSize: 20,
    borderColor: "transparent",
    borderBottomColor: theme.colors.productListInputBorder,
    borderWidth: 1,
    width: windowWidth - 100,
    marginVertical: 10,
    color: theme.colors.noteItemTextColor,
  },
  h4: {
    color: theme.colors.noteItemTextColor,
  },
  dateText: { fontSize: 20, color: theme.colors.noteItemTextColor },
  permanentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
});
