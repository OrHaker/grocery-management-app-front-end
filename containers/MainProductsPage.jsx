import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Vibration, View, FlatList, Share } from "react-native";
import { Alert, Text } from "react-native";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ACTIONS from "../store/actions/actions";
//ELEMENTS
import Header from "../components/Header";
import ProductItem from "../components/ProductItem";
import AddProductForm from "../components/AddProductForm";
import ProductsShareFAB from "../components/ProductsShareFAB";
import { Snackbar } from "react-native-paper";
//PUSH NOTIFICATION UTIL
import { Notifications } from "expo";
import registerForPushNotificationsAsync from "../utils/registerForPushNotificationsAsync";
import { MyTheme, itemsURL } from "../utils/constants";

function MainProducts({ navigation }) {
  const currUser = useSelector((state) => state.userAndSiteReducer.currUser);
  const dispatch = useDispatch();

  const listRef = useRef(null);

  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [snackbarVisibility, setSnackbarVisibility] = useState(false);
  const [tempDeletedItem, setTempDeletedItem] = useState({});

  //update store user
  const updateUser = async (family) =>
    await dispatch(ACTIONS.loginAction(family));
  //delete item
  const _handleDleteItem = async (item) => {
    Vibration.vibrate();
    setTempDeletedItem(item);
    setSnackbarVisibility(true);
    const req = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    await fetch(
      itemsURL + `?ItemCode=${item.ItemCode}&FamilyCode=${item.FamilyCode}`,
      req
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "NotFound" && data !== "BadRequest") {
          let temp = items;
          temp = temp.filter((i) => i.ItemCode !== item.ItemCode);
          setItems(temp);
          dispatch(ACTIONS.updateItemsAction(temp));
        } else {
          Alert.alert("✋", "סליחה אבל משהו השתבש");
        }
      });
  };

  //update item
  const _handleUpdateItem = (item) => {
    const product = items.find((i) => i.ItemCode === item.ItemCode);
    navigation.navigate("EditProduct", { product });
  };

  //add item
  const _handleAddItem = async (item) => {
    let temp = null;
    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    };
    await fetch(itemsURL, req)
      .then((res) => {
        if (res.status === 201) return res.json();
        else if (res.status === 404) return "NotFound";
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "NotFound" && data !== "BadRequest") {
          temp = data;
        }
      });
    if (temp !== null) {
      setItems([...items, temp]);
      dispatch(ACTIONS.updateItemsAction([...items, temp]));
    } else {
      Alert.alert("✋", "סליחה אבל משהו בפעולה שעשית השתבש");
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
    await fetch(itemsURL + `/${currUser.FamilyCode}`, req)
      .then((response) => {
        if (response.status === 200) return response.json();
        else return "BadRequest";
      })
      .then((data) => {
        if (data !== "BadRequest") {
          dispatch(ACTIONS.updateItemsAction(data));
          value = data;
        }
      });
    return value;
  };

  //handle refresh list
  const _handleRefresh = async () => {
    setIsFetching(true);
    const refreshedItems = await _getItemsFromDB();
    setItems(refreshedItems);
    setIsFetching(false);
  };

  async function fetchMyAPI() {
    setIsFetching(true);
    const refreshedItems = await _getItemsFromDB();
    setItems(refreshedItems);
    setIsFetching(false);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchMyAPI();
    });
    //notifications
    Notifications.addListener(_handleNotification);
    registerForPushNotificationsAsync(currUser).then(async (token) => {
      if (currUser.Token !== token) {
        console.log([token, currUser.Token]);
        await updateUser({ ...currUser, Token: token });
      }
    });
    return unsubscribe;
  }, [navigation]);

  //share list content Via Whatsapp
  const _shareViaWhatsapp = () => {
    Share.share({
      message: _getListContentToString(),
      url: null,
      title: "הרשימה שלי",
    })
      .then((result) => {
        if (result === "dismissedAction") {
          return;
        }
      })
      .catch((err) => console.log(err));
  };

  //concate list contant to string
  const _getListContentToString = () => {
    let listContent = "";
    items.forEach((i) => {
      listContent += `${i.Description} ${i.Count}\n`;
    });
    listContent += "😁 מקווה שלא שחכנו כלום ";
    return listContent;
  };

  //handle undo product deletion
  const _handleUNDO = () => {
    _handleAddItem(tempDeletedItem);
    setTempDeletedItem({});
  };

  //handle push notification app enter
  const _handleNotification = () => {
    Vibration.vibrate();
    navigation.navigate("Notes");
  };

  return (
    <React.Fragment>
      <Header screenName="הרשימה שלי " subTitle="נעזור לך לא לשכוח אף פריט" />
      <View style={styles.flatList}>
        <FlatList
          onContentSizeChange={() => listRef.current.scrollToEnd()}
          ref={listRef}
          refreshing={isFetching}
          onRefresh={_handleRefresh}
          data={items}
          keyExtractor={(item) => item.ItemCode.toString()}
          renderItem={({ item }, index) => (
            <ProductItem
              item={item}
              key={index}
              itemCode={item.ItemCode}
              description={item.Description}
              count={item.Count}
              categoryCode={item.CategoryCode}
              handleDleteItem={_handleDleteItem}
              handleUpdateItem={() => _handleUpdateItem(item)}
              duration={700 + index * 100}
            />
          )}
        />
      </View>
      <Text style={styles.totalProductsMessage}>
        {`סה"כ ${items ? items.length : "0"} מוצרים שונים`}
      </Text>
      <View style={styles.bottomForm}>
        <AddProductForm
          familyCode={currUser.FamilyCode}
          addItem={_handleAddItem}
          setReduxCategories={(categories) =>
            dispatch(ACTIONS.setCategoriesAction(categories))
          }
          setIsFetching={setIsFetching}
        />
      </View>
      <View style={styles.fabContainer}>
        <ProductsShareFAB shareViaWhatsapp={_shareViaWhatsapp} />
      </View>
      <Snackbar
        style={styles.snackbar}
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
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    width: 70,
    height: 190,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    right: -5,
  },
  scrollView: { width: "95%", flex: 1, marginTop: 20 },
  bottomForm: {
    width: "100%",
    flex: 0.8,
    borderColor: "#000",
    borderWidth: 1,
    bottom: 0,
    zIndex: 1,
  },
  flatList: {
    flex: 1,
    backgroundColor: MyTheme.colors.productsListBackground,
  },
  snackbar: {
    zIndex: 4,
  },
  totalProductsMessage: {
    textAlign: "center",
    backgroundColor: MyTheme.colors.productsListBackground,
    color: MyTheme.colors.productsListTextColor,
  },
});

export default MainProducts;
