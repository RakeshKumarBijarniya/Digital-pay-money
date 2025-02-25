import React from "react";
import { Tabs } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import CustomTabBar from "@/src/component/atoms/CustomTabBar";

const TabRoot = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // This should hide the header for all tabs
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
          title: "My Home",
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          headerShown: false, // Ensure History tab hides header
          tabBarLabel: "History",
        }}
      />
    </Tabs>
  );
};

export default TabRoot;
