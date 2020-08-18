import { AsyncStorage } from "react-native";

//helper functions
export const storeAsyncStorageData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log("storeAsyncStorageData error", error);
  }
};

export const retrieveAsyncStorageData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log("retrieveAsyncStorageData error", error);
    return null;
  }
};

export function iconEmoji(categoryCode) {
  switch (categoryCode) {
    case 1:
      return "🍎";
    case 2:
      return "🍗";
    case 3:
      return "🥑";
    case 4:
      return "🧀";
    case 5:
      return "🍞";
    case 6:
      return "🛒";
    case 7:
      return "🥤";
    case 8:
      return "🛍";
    default:
      return "📝";
  }
}
