import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Modal } from "react-native-paper";
import PropTypes from "prop-types";
import { MyTheme } from "../utils/constants";

//Help the user identify that an action is happening
export default function LoadingSpinner({ isLoading }) {
  return (
    <Modal visible={isLoading} style={styles.modal}>
      <View>
        <ActivityIndicator size={70} color={MyTheme.colors.headerText} />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    height: "100%",
    width: "100%",
  },
});

LoadingSpinner.propTypes = {
  isLoading: PropTypes.bool,
};
