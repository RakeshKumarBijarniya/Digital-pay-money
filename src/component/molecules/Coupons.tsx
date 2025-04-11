import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import React from "react";

const data = [1, 2, 3, 4, 5, 6];

const Coupons = () => {
  return (
    <View style={styles.mainContainer}>
      <Text
        style={{
          fontWeight: "600",
          fontSize: 17,
          fontFamily: "SansitaSwashedBold",
        }}
      >
        Coupons
      </Text>
      <FlatList
        data={data}
        horizontal={true}
        renderItem={({ item }) => (
          <View style={{ marginRight: 20, marginTop: 10 }}>
            <Image
              source={require("@/src/assets/images/CouponLargeImage.png")}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F6F4F0",
    top: 40,
    padding: 10,
    borderRadius: 10,
    height: 260,
  },
});

export default Coupons;
