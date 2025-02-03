import React from "react";
import { Tabs } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import CustomTabBar from "@/src/component/atoms/CustomTabBar";
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
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Home", // Title for the screen header
          tabBarLabel: "Home", // Label for the tab bar
        }}
      />

      <Tabs.Screen name="History" />
    </Tabs>
  );
};

export default TabRoot;
