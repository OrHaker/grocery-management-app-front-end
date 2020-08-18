import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { MyTheme } from "../utils/constants";

// increase or decrease products count
export default function CounterAction({ action, title }) {
  const textStyle = {
    fontSize: title === "-" ? 30 : 20,
    color: MyTheme.colors.productsListTextColor,
    paddingHorizontal: 20,
  };
  return (
    <TouchableOpacity onPress={() => action()}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}
