import React from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { List, Button } from "react-native-paper";
import { MyTheme } from "../utils/constants";

//uses to render every note item on the flat list
const NoteItem = (props) => {
  const [logoAnime, setLogoAnime] = React.useState(new Animated.Value(0));

  const { timeAndDate, description, note, duration } = props;

  //function that check if the notes date passed by comparison with local date
  const _checkIfDatePassed = () => {
    const dateArr = timeAndDate.split("/");
    const date = new Date(
      "20" + dateArr[2],
      parseInt(dateArr[1]) - 1,
      parseInt(dateArr[0])
    );
    return new Date() > date;
  };

  React.useEffect(() => {
    //poping logo animation
    logoAnime.setValue(0);
    Animated.spring(logoAnime, {
      toValue: 1,
      tension: 10,
      friction: 2.5,
      duration: duration || 800,
    }).start();
  }, [description, timeAndDate]);

  return (
    <Animated.View
      style={{
        opacity: logoAnime,
        top: logoAnime.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      }}
    >
      <List.Subheader style={styles.selftToRight}>{timeAndDate}</List.Subheader>
      <List.Item
        onPress={() => props.handleUpdateNote(note)}
        titleStyle={{
          ...styles.selftToRight,
          textDecorationLine: _checkIfDatePassed() ? "line-through" : "none",
        }}
        style={styles.item}
        title={description}
        right={() => (
          <List.Icon
            icon="calendar-text-outline"
            color={MyTheme.colors.noteItemTextColor}
          />
        )}
        left={() => {
          return (
            <TouchableOpacity onPress={() => props.handleDeleteNote(note)}>
              <List.Icon
                icon="trash-can-outline"
                color={MyTheme.colors.noteItemTextColor}
              />
            </TouchableOpacity>
          );
        }}
      />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  item: {
    borderBottomColor: MyTheme.colors.noteItemBorderColor,
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  selftToRight: {
    alignSelf: "flex-end",
    color: MyTheme.colors.noteItemTextColor,
  },
});
export default NoteItem;
