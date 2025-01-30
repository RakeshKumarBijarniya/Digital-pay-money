import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { moderateScale } from "react-native-size-matters";

const TabRoot = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#2E5077",
          height: moderateScale(42),
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    </Tabs>
  );
};

export default TabRoot;
