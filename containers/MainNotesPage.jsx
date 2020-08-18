import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Vibration, Text } from "react-native";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import { Snackbar } from "react-native-paper";
import Header from "../components/Header";
import NoteItem from "../components/NoteItem";
import AddNoteForm from "../components/AddNoteForm";
import { MyTheme, notesURL } from "../utils/constants";

const MainNotes = ({ navigation }) => {
  const currUser = useSelector((state) => state.userAndSiteReducer.currUser);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [snackbarVisibility, setSnackbarVisibility] = useState(false);
  const [tempDeletedNote, setTempDeletedNote] = useState({});

  //delete item
  const _handleDeleteNote = async (note) => {
    Vibration.vibrate();
    setSnackbarVisibility(true);
    setTempDeletedNote(note);
    console.log(" _handleDleteNote => note", JSON.stringify(note));
    const req = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(note),
    };
    await fetch(
      notesURL + `?NoteCode=${note.NoteCode}&FamilyCode=${note.FamilyCode}`,
      req
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "NotFound" && data !== "BadRequest") {
          let temp = notes;
          temp = temp.filter((n) => n.NoteCode !== note.NoteCode);
          setNotes(temp);
          dispatch(ACTIONS.updateNotesAction(temp));
        } else {
          Alert.alert("✋", "...משהו קרה בדרך");
        }
      });
  };

  //update item
  const _handleUpdateNote = (note) => {
    navigation.navigate("EditNote", { note });
  };

  //add item
  const _handleAddNote = async (note) => {
    let temp = null;
    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(note),
    };
    console.log("JSON.stringify(note)", JSON.stringify(note));
    await fetch(notesURL, req)
      .then((res) => {
        if (res.status === 201) return res.json();
        return "BadRequest";
      })
      .then((data) => {
        if (data !== "BadRequest") {
          temp = data;
        }
      });
    if (temp !== null) {
      setNotes([...notes, temp]);
      dispatch(ACTIONS.updateNotesAction([...notes, temp]));
    } else {
      Alert.alert("✋", "יש שדות ריקים");
    }
    setIsFetching(false);
  };

  //get items
  const _getItemsFromDB = async () => {
    let value = null;
    const req = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    await fetch(notesURL + `/${currUser.FamilyCode}`, req)
      .then((response) => {
        if (response.status === 200) return response.json();
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "BadRequest") {
          dispatch(ACTIONS.updateNotesAction(data));
          value = data;
        }
      });
    return value;
  };

  //handle refresh list
  const _handleRefresh = async () => {
    setIsFetching(true);
    const refreshedNotes = await _getItemsFromDB();
    setNotes(refreshedNotes);
    setIsFetching(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      async function fetchMyAPI() {
        setIsFetching(true);
        const refreshedNotes = await _getItemsFromDB();
        setNotes(refreshedNotes);
        dispatch(ACTIONS.updateNotesAction(refreshedNotes));
        setIsFetching(false);
      }
      fetchMyAPI();
    });
    return unsubscribe;
  }, [navigation]);

  //handle undo note deletion
  const _handleUNDO = () => {
    _handleAddNote(tempDeletedNote);
    setTempDeletedNote({});
  };
  return (
    <>
      <Header screenName="הפתקים שלי 📜 " subTitle="עקוב אחר המשימות שלך" />
      <View style={styles.container}>
        {/* <Text>{JSON.stringify(tempDeletedNote)}</Text> */}
        <View style={styles.flatList}>
          <Text style={styles.topMessage}>פתקים שתאריכם עבר יהיו מסומנים</Text>
          <FlatList
            refreshing={isFetching}
            onRefresh={_handleRefresh}
            data={notes}
            keyExtractor={(note) => note.NoteCode.toString()}
            renderItem={({ item, index }) => (
              <NoteItem
                note={item}
                key={index}
                FamilyCode={item.FamilyCode}
                NoteCode={item.NoteCode}
                description={item.Description}
                timeAndDate={item.TimeAndDate}
                handleDeleteNote={_handleDeleteNote}
                handleUpdateNote={_handleUpdateNote}
                duration={800}
              />
            )}
          />
        </View>
        <View style={styles.bottomForm}>
          <AddNoteForm
            setIsFetching={setIsFetching}
            addNote={_handleAddNote}
            familyCode={currUser.FamilyCode}
          />
        </View>
      </View>
      <Snackbar
        visible={snackbarVisibility}
        onDismiss={() => {
          setSnackbarVisibility(false);
        }}
        action={{
          label: "בטל",
          onPress: _handleUNDO,
        }}
        duration={Snackbar.DURATION_SHORT}
      >
        אתה עדיין יכול להתחרט..
      </Snackbar>
    </>
  );
};
const styles = StyleSheet.create({
  bottomForm: {
    width: "100%",
    flex: 0.4,
    borderColor: "#000",
    borderWidth: 1,
    bottom: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: MyTheme.colors.notesBackgroundColor,
  },
  flatList: {
    flex: 0.8,
    width: "100%",
  },
  topMessage: { color: MyTheme.colors.inputText, marginBottom: -10 },
});

export default MainNotes;
