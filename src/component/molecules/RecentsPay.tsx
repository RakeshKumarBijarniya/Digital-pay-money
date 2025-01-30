import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import { FlatList } from "react-native-gesture-handler";

const names = ["Ram", "Shyam", "Hanuman", "Laxman", "Arun"];

const RecentsPay = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={{ fontFamily: "SansitaSwashedBold", fontSize: 17 }}>
        Recent payees
      </Text>
      <FlatList
        data={names}
        horizontal={true}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#79D7BE",
                width: 80,
                top: 10,
                borderRadius: "50%",
                marginLeft: 20,
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                {item.split("").slice(0, 1).join()}
              </Text>
            </View>
            <Text
              style={{ fontSize: 20, textAlign: "center", top: 10, left: 15 }}
            >
              {item}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F6F4F0",
    top: 20,
    padding: 10,
    borderRadius: 10,
    height: 200,
  },
});
export default RecentsPay;
