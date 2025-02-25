import { Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState(false);

  const storage = Platform.OS === "web" ? global.localStorage : AsyncStorage;

  const checkLoginData = async () => {
    try {
      let checkAuth;
      if (Platform.OS === "web") {
        checkAuth = storage.getItem("myData"); // localStorage is synchronous
      } else {
        checkAuth = await storage.getItem("myData");
      }

      if (checkAuth) {
        setAuthUser(true);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkLoginData();
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Ensure smooth transition
      await SplashScreen.hideAsync(); // Hide splash after check is done
    };

    init();
  }, []);

  if (isLoading) {
    return null; // Prevent UI from rendering until the check is complete
  }

  if (authUser) {
    return <Redirect href="/(main)/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/Login" />;
  }
};

export default Auth;
