import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { Text } from "react-native-elements";
import { Appbar } from "react-native-paper";
import { MyTheme } from "../utils/constants";
import { iconEmoji } from "../utils/utilsFuncs";

const windowWidth = Dimensions.get("window").width;

//uses to render every product item on the products flat list
const Item = (props) => {
  const [height, setHeight] = React.useState(new Animated.Value(0));
  const [opacity, setOpacity] = React.useState(new Animated.Value(0));

  const { categoryCode, description, count, itemCode, item } = props;
  const { handleDleteItem, handleUpdateItem, duration } = props;

  React.useEffect(() => {
    height.setValue(0);
    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(height, {
        toValue: 70,
        duration: duration || 800,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration || 800,
      }),
    ]).start();
  }, [count, description, categoryCode]);

  return (
    <Animated.View
      style={{ height: height, opacity: opacity, ...styles.container }}
    >
      <View style={styles.buttons}>
        <Appbar.Action
          color={MyTheme.colors.productsListIconsColor}
          icon="delete"
          onPress={() => handleDleteItem(item)}
        />
      </View>
      <View style={styles.count}>
        <Text onPress={() => handleUpdateItem(itemCode)} style={styles.text}>
          {count}
        </Text>
      </View>
      <View style={styles.description}>
        <Text onPress={() => handleUpdateItem(itemCode)} style={styles.text}>
          {description}
        </Text>
      </View>
      <View style={styles.icon}>
        <Text style={styles.emoji} onPress={() => handleUpdateItem(itemCode)}>
          {iconEmoji(categoryCode)}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    borderColor: MyTheme.colors.productsListBordersColor,
    borderBottomWidth: 1,
    height: 70,
  },
  icon: {
    width: (windowWidth / 8) * 2,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 30,
  },
  description: {
    justifyContent: "center",
    width: (windowWidth / 8) * 4,
    paddingRight: 5,
    color: MyTheme.colors.productsListTextColor,
  },
  buttons: {
    // borderRightColor: MyTheme.colors.productsListBordersColor,
    // borderRightWidth: 1,
    width: (windowWidth / 8) * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 15,
    color: MyTheme.colors.productsListTextColor,
  },
  emoji: { fontSize: 20 },
  text: {
    color: MyTheme.colors.productsListTextColor,
  },
});
export default Item;
