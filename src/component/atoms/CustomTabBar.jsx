import { router, usePathname } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { moderateScale } from "react-native-size-matters";

const CustomTabBar = () => {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace("/(main)/(tabs)")}
        style={[
          styles.tabItem,
          pathname === "/(main)/(tabs)" && styles.focusedTab,
        ]}
      >
        <Image
          source={require("@/src/assets/images/HomeIcon.png")}
          resizeMode="contain"
          style={{
            width: moderateScale(30),
            height: moderateScale(30),
            top: moderateScale(8),
          }}
        />
        <Text
          style={[
            styles.tabText,

            pathname === "/(main)/(tabs)" && styles.focusedText,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* History Tab */}
      <TouchableOpacity
        onPress={() => router.replace("/(main)/BarCodeScanner")}
        style={[
          styles.tabItem,
          pathname === "/(main)/BarCodeScanner" && styles.focusedTab,
        ]}
      >
        <Image
          source={require("@/src/assets/images/scannerIcon.png")}
          resizeMode="contain"
          style={{
            width: moderateScale(50),
            height: moderateScale(50),
            top: moderateScale(5),
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/(main)/History")}
        style={[styles.tabItem]}
      >
        <Image
          source={require("@/src/assets/images/HistoryIcon.png")}
          resizeMode="contain"
          style={{
            width: moderateScale(30),
            height: moderateScale(30),
            top: moderateScale(8),
          }}
        />
        <Text style={[styles.tabText]}>History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#2E5077",
    height: moderateScale(50), // Increased for better touch
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(10),
  },
  focusedTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFD700", // Gold color for highlight
  },
  tabText: {
    color: "#fff", // Light gray by default
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  focusedText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomTabBar;
