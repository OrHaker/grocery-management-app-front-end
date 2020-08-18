import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Header from "../components/Header";
import MapPlaceDetailsCard from "../components/MapPlaceDetailsCard";
import { locations } from "../utils/dataArray";
import LoadingSpinner from "../components/LoadingSpinner";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [moreDetails, setMoreDetails] = useState(false);
  const [detailsToShow, setDetailsToShow] = useState({});
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    async function fetchMyLocation() {
      const loc = await _getLocation();
    }
    fetchMyLocation();
  }, []);

  //function to get user current location
  const _getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("✋", "הגישה למיקום נדחתה השירות לא יעבוד חלקה. ");
      return;
    }
    let myLocation = await Location.getCurrentPositionAsync({});
    setLocation(myLocation.coords);
    setRegion({
      ...region,
      latitude: myLocation.coords.latitude,
      longitude: myLocation.coords.longitude,
    });
    return myLocation.coords;
  };

  //reset map camera
  const _resetMap = () => {
    setMoreDetails(false);
    setRegion({
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  //show view with markers data on the screen
  const _showMarkersMoreDetails = async (e, place) => {
    e.stopPropagation();
    //set map region to the markers region
    setRegion({
      latitude: place[1],
      longitude: place[2],
    });
    //get the address of the marker location
    const reverseGeoCode = await Location.reverseGeocodeAsync({
      latitude: place[1],
      longitude: place[2],
    });
    setDetailsToShow({
      title: place[4],
      description: `${place[3]}\n`,
      reverseGeoCode: reverseGeoCode[0],
      rating: Math.floor(Math.random() * 6) + 1,
    });
    setMoreDetails(true);
  };

  //render Spinner untill map is ready
  if (location === null)
    return (
      <>
        <Header screenName="מפות 🗺" subTitle="מצא סופרים באזורך" />
        <LoadingSpinner isLoading={true} />
      </>
    );
  else
    return (
      <>
        <Header screenName="מפות 🗺" subTitle="מצא סופרים באזורך" />
        <View style={styles.container}>
          <MapView
            style={styles.mapStyle}
            region={region}
            onLongPress={_resetMap}
            onPress={() => setMoreDetails(false)}
          >
            <Marker
              coordinate={{
                latitude: location?.latitude,
                longitude: location?.longitude,
              }}
              title="אתה כאן"
              description="מיקום נוכחי"
            >
              <Image
                source={require("../assets/manicon.png")}
                style={{ height: 50, width: 30 }}
              />
            </Marker>
            {locations.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place[1],
                  longitude: place[2],
                }}
                title={place[4]}
                pinColor={"blue"}
                onPress={(e) => _showMarkersMoreDetails(e, place)}
              />
            ))}
          </MapView>
          {moreDetails && (
            <MapPlaceDetailsCard
              title={detailsToShow.title}
              description={detailsToShow.description}
              address={`${detailsToShow.reverseGeoCode.street} ${detailsToShow.reverseGeoCode.name} ,${detailsToShow.reverseGeoCode.city}`}
              rating={detailsToShow.rating}
            />
          )}
        </View>
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#aaa",
  },
  mapStyle: {
    width: Dimensions.get("window").width - 5,
    height: Dimensions.get("window").height,
  },
});

export default MapScreen;
