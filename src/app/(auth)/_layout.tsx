import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthRoot = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Login" />
    </Stack>
  );
};

export default AuthRoot;
