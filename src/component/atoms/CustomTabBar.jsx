import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  console.log(state);
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.focusedTab]}
          >
            <Text style={[styles.tabText, isFocused && styles.focusedText]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#2E5077",
    height: moderateScale(42),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  focusedTab: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  tabText: {
    color: "gray",
    fontSize: moderateScale(14),
  },
  focusedText: {
    color: "white",
  },
});

export default CustomTabBar;
