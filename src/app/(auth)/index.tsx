import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <View>
      <Text>Auth</Text>
      <Link href={"/Login"}>Login</Link>
      <TouchableOpacity onPress={() => router.push("/(main)/(tabs)")}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size={30} color={"green"} />}
    </View>
  );
};

export default Auth;
