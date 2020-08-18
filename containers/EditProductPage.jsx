import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, TextInput, View } from "react-native"; //Picker,
//REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import Header from "../components/Header";
import FormCounterAction from "../components/FormCounterAction";
import { MyTheme as theme, itemsURL } from "../utils/constants";
import { Button } from "react-native-paper";
import { Picker } from "native-base";
import { Text as ElementText, Input } from "react-native-elements";
import { iconEmoji } from "../utils/utilsFuncs";

const EditProduct = ({ route, navigation }) => {
  const categories = useSelector(
    (state) => state.itemsAndNotesReducer.categories
  );
  const items = useSelector((state) => state.itemsAndNotesReducer.items);
  const dispatch = useDispatch();
  const [product, setProduct] = useState({
    ItemCode: 1,
    CategoryCode: 1,
    Description: "",
    Count: 1,
    FamilyCode: 1,
  });

  //update item info on DB
  const _handleUpdateItem = async (item) => {
    for (const key in item) {
      if (item[key] === "") {
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
      body: JSON.stringify(item),
    };
    let temp = null;
    await fetch(itemsURL + `?id=${item.ItemCode}`, reqBody)
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "NotFound" && data !== "BadRequest") {
          temp = items;
          temp = temp.map((i) => {
            if (i.ItemCode === data.ItemCode) return data;
            else return i;
          });
        } else {
          Alert.alert("✋", "סליחה אבל משהו השתבש");
        }
      });
    if (temp !== null) {
      dispatch(ACTIONS.updateItemsAction(temp));
      navigation.navigate("MainProducts");
    }
  };

  useEffect(() => {
    setProduct(route.params.product);
  }, []);

  return (
    <React.Fragment>
      <Header screenName="עריכת מוצר" />
      <View
        style={{
          paddingTop: 150,
          flex: 1,
          backgroundColor: theme.colors.productsListBackground,
        }}
      >
        <View style={styles.container}>
          <ElementText h4 h4Style={styles.h4}>
            עריכת מוצר
          </ElementText>
          <Picker
            style={{ width: 250, color: theme.colors.productsListTextColor }}
            selectedValue={product.CategoryCode}
            onValueChange={(itemValue) =>
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
          {/*Description */}
          <Input
            inputStyle={{ color: theme.colors.productsListTextColor }}
            value={product.Description}
            placeholder="...תיאור מוצר"
            onChangeText={(Description) =>
              setProduct({ ...product, Description })
            }
            leftIcon={{
              type: "font-awesome-5",
              name: "clipboard-list",
              color: theme.colors.productsListTextColor,
            }}
          />
          {/*Count */}
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
            icon="autorenew"
            color={theme.colors.buttonBackgroundColor}
            mode="contained"
            onPress={() => _handleUpdateItem(product)}
          >
            עדכן
          </Button>
        </View>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  h4: {
    color: theme.colors.inputText,
    textAlign: "center",
  },
  alignSelfView: {
    marginVertical: 10,
    width: 120,
    alignSelf: "center",
  },
  row: {
    color: theme.colors.productsListTextColor,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  count: {
    width: 30,
    textAlign: "center",
    fontSize: 20,
    color: theme.colors.productsListTextColor,
  },
});

export default EditProduct;
