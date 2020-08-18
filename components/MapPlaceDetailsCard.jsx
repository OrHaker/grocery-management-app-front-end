import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { Rating } from "react-native-elements";

//maps more details component
export default function MoreDetails({ title, description, rating, address }) {
  return (
    <View style={styles.moreDetails}>
      <Card>
        <Card.Content>
          <Title>{title}</Title>
          <Paragraph>{`${description}\n${address}\nדירוג בגוגל מפות`}</Paragraph>
          <Rating imageSize={20} readonly startingValue={rating || 3} />
        </Card.Content>
        <Card.Cover
          source={{
            uri:
              "https://images.unsplash.com/photo-1556767576-cf0a4a80e5b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80",
          }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  moreDetails: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
