import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const Electricity = () => {
  return (
    <View>
      <TouchableOpacity onPress={() => router.push("/(main)")}>
        <Text>Electricity</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Electricity;
