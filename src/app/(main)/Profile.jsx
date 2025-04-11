import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { moderateScale } from "react-native-size-matters";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem("myData");

      setUserData(JSON.parse(data));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            style={{ top: moderateScale(-30) }}
            onPress={() => router.push("/(main)/UpdateProfile")}
          >
            <Image
              source={require("@/src/assets/images/Pencil 01.png")}
              resizeMode="contain"
              style={{
                width: moderateScale(20),
                height: moderateScale(20),

                alignSelf: "flex-end",
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("@/src/assets/images/userLargeIcon.png")}
            resizeMode="contain"
            style={{ width: moderateScale(150), height: moderateScale(150) }}
          />
          {userData ? (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 17, fontWeight: 700 }}>
                {userData.name}
              </Text>
              <Text style={{ fontSize: 17, opacity: 0.7 }}>
                {`+91-${userData.phone}`}
              </Text>
              <Text style={{ fontSize: 17, opacity: 0.7 }}>
                {userData.email}
              </Text>
            </View>
          ) : (
            <View>
              <Text>Parul</Text>
              <Text>+91-9191919191</Text>
              <Text>Parul123@gmail.com</Text>
            </View>
          )}

          <Text>UP1012@upi</Text>
        </View>
        <View
          style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
        >
          <Text style={{ fontSize: 17, fontWeight: 600 }}>Saved address</Text>
          {userData ? (
            <Text>{userData.address}</Text>
          ) : (
            <Text>xyz mansrovar Jaipur, Rajasthan,302017</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#4B83C3",
    height: "100%",
    flex: 1,
  },
  profileContainer: {
    backgroundColor: "#fff",
    margin: moderateScale(10),
    borderRadius: 10,
    paddingVertical: moderateScale(40),
    paddingHorizontal: 10,
  },
  addressButton: {
    backgroundColor: "#2E5077",
    borderRadius: 10,
    width: moderateScale(150),
    padding: 5,
    alignItems: "center",
  },
});

export default Profile;
