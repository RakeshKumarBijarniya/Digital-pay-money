import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const Root = () => {
  const [isLogin, setIsLogin] = useState(null); // null means "still checking"

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // 💥 Clear login data every time app launches
        await AsyncStorage.removeItem("myData");

        // Simulate loading/checking login state
        await new Promise((resolve) => setTimeout(resolve, 1000)); // short delay for smooth transition

        const storedUser = await AsyncStorage.getItem("myData");
        setIsLogin(!!storedUser); // always false after clearing
      } catch (err) {
        console.warn("Splash load error", err);
        setIsLogin(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (isLogin === null) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href={isLogin ? "/(main)" : "/(auth)"} />
    </>
  );
};

export default Root;
