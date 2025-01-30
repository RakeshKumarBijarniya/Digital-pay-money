import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
const Root = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
  }, []);
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {isLogin ? (
          <Redirect href={"/(main)"} />
        ) : (
          <Redirect href={"/(auth)"} />
        )}
      </Stack>
    </>
  );
};

export default Root;
