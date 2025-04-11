import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomHeader = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storage =
        Platform.OS === "web" ? global.localStorage : AsyncStorage;
      const data = await storage.getItem("myData");
      setUserData(JSON.parse(data));
    };
    fetchData();
  }, []);
  return (
    <View
      style={{
        backgroundColor: "#ffff",
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={{ fontSize: moderateScale(20) }}>☰</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", left: 20 }}>
          <Image
            source={{
              uri: "https://6916-110-235-219-122.ngrok-free.app/api/v1/uploads/1738749442550-mernPic.jpeg",
            }}
            resizeMode="contain"
            style={{
              width: moderateScale(47),
              height: moderateScale(35),
              borderRadius: 100,
            }}
          />

          {userData ? (
            <>
              <Image
                source={{ uri: `${userData.image}` }}
                style={{
                  width: moderateScale(30),
                  height: moderateScale(30),
                  right: moderateScale(30),
                }}
              />
              <Text style={{ fontSize: 17, fontWeight: 600 }}>
                {userData.name}
              </Text>
            </>
          ) : (
            <Text>Hello Parul</Text>
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("@/src/assets/images/searchIcon.png")}
          resizeMode="contain"
          style={{ width: scale(35), height: moderateScale(25), top: 3 }}
        />

        <Image
          source={require("@/src/assets/images/bellIcon.png")}
          resizeMode="contain"
          style={{ width: moderateScale(30), height: moderateScale(20) }}
        />
      </View>
    </View>
  );
};

export default CustomHeader;
