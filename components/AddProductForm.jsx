import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { Dimensions, ScrollView } from "react-native";
import { MyTheme as theme, MyTheme } from "./../utils/constants";
import { Button } from "react-native-paper";
import { Picker } from "native-base";
import FormCounterAction from "./FormCounterAction";
import { iconEmoji } from "./../utils/utilsFuncs";
import { categoriesURL } from "../utils/constants";

const windowWidth = Dimensions.get("window").width;

//add product bottom form
export default function AddProductForm(props) {
  const { setIsFetching, addItem, setReduxCategories, familyCode } = props;

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    ItemCode: 0,
    CategoryCode: 1,
    Description: "",
    Count: 1,
    FamilyCode: familyCode,
  });

  const _getItemsFromDB = async () => {
    let value = null;
    const req = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    await fetch(categoriesURL, req)
      .then((response) => {
        if (response.status === 200) return response.json();
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "BadRequest") {
          value = data;
        }
      });
    return value;
  };

  useEffect(() => {
    async function fetchMyAPI() {
      const refreshedItems = await _getItemsFromDB();
      setCategories(refreshedItems);
      setReduxCategories(refreshedItems);
    }
    fetchMyAPI();
  }, []);

  const _addItem = () => {
    for (const property in product)
      if (product[property] === "") {
        Alert.alert(
          "🤔 שדות ריקים",
          "ישנם שדות ריקים\n אנא מלא אותם ונסה שנית."
        );
        return;
      }
    setIsFetching(true);
    addItem(product);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={[styles.text, styles.h4]}>הוסף פריט חדש</Text>
        <Picker
          style={styles.picker}
          selectedValue={product.CategoryCode}
          onValueChange={(itemValue, itemPosition) =>
            setProduct({ ...product, CategoryCode: itemValue })
          }
        >
          {categories.map((c, index) => (
            <Picker.Item
              key={index}
              label={`${iconEmoji(c.CategoryCode)}   ${c.CategoryName}`}
              value={c.CategoryCode}
            />
          ))}
        </Picker>
        <Text style={{ color: MyTheme.colors.productsListTextColor }}>
          תיאור פריט
        </Text>
        <TextInput
          onChangeText={(Description) =>
            setProduct({ ...product, Description })
          }
          style={styles.input}
        />
        <View style={styles.row}>
          <FormCounterAction
            title="-"
            action={() => {
              if (product.Count <= 0) return;
              setProduct({ ...product, Count: parseInt(product.Count) - 1 });
            }}
          />
          <TextInput
            editable={false}
            style={styles.count}
            value={product.Count.toString()}
          />
          <FormCounterAction
            title="+"
            action={() =>
              setProduct({ ...product, Count: parseInt(product.Count) + 1 })
            }
          />
        </View>
        <Button
          color={theme.colors.buttonBackgroundColor}
          mode="contained"
          onPress={_addItem}
        >
          הוסף
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.productsListBackground,
    borderWidth: 0.5,
  },
  input: {
    height: 25,
    borderColor: "transparent",
    borderBottomColor: theme.colors.productListInputBorder,
    borderWidth: 1,
    width: windowWidth - 120,
    marginVertical: 10,
    color: theme.colors.productsListTextColor,
  },
  row: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  count: {
    width: windowWidth / 8,
    textAlign: "center",
    fontSize: 20,
    color: theme.colors.productsListTextColor,
  },
  h4: {
    color: theme.colors.productsListTextColor,
  },
  text: { fontSize: 20 },
  picker: {
    width: 250,
    marginLeft: windowWidth / 2 - 150,
    color: MyTheme.colors.productsListTextColor,
  },
});
