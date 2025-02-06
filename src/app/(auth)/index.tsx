import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Redirect, router } from "expo-router";
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
      const checkAuth = await storage.getItem("myData");
      if (checkAuth) {
        setAuthUser(true);
        router.push("/(main)/(tabs)");
      } else {
        router.push("/(auth)/Login");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
      await SplashScreen.hideAsync(); // Hide splash screen
    }
  };

  useEffect(() => {
    checkLoginData();
  }, []);

  if (isLoading) {
    return null; // Splash screen will be shown until authentication is checked
  }

  if (authUser) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default Auth;
