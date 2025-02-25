import { router, usePathname } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const CustomTabBar = () => {
  const pathname = usePathname(); // Get current route

  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        onPress={() => router.replace("/(main)/(tabs)")}
        style={[
          styles.tabItem,
          pathname === "/(main)/(tabs)" && styles.focusedTab,
        ]}
      >
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
        onPress={() => router.replace("/(main)/Scanner")}
        style={[
          styles.tabItem,
          pathname === "/(main)/Scanner" && styles.focusedTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            pathname === "/(main)/Scanner" && styles.focusedText,
          ]}
        >
          Camera
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.replace("/(main)/(tabs)/History")}
        style={[
          styles.tabItem,
          pathname === "/(main)/(tabs)/History" && styles.focusedTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            pathname === "/(main)/(tabs)/History" && styles.focusedText,
          ]}
        >
          History
        </Text>
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
    color: "#B0B0B0", // Light gray by default
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  focusedText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomTabBar;
