import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";

const cuponNum = [1, 2, 3];

const Discount = () => {
  return (
    <View style={styles.mainContainer}>
      <Text
        style={{
          fontWeight: "600",
          fontSize: 17,
          fontFamily: "SansitaSwashedBold",
          top: 10,
        }}
      >
        Discount
      </Text>
      <View style={{ flexDirection: "row" }}>
        <FlatList
          data={cuponNum}
          horizontal={true}
          renderItem={({ item }) => (
            <View
              style={{
                paddingHorizontal: moderateScale(10),
                top: 10,
                marginBottom: 0,
              }}
            >
              <Image
                source={require("@/src/assets/images/Card.png")}
                style={{
                  width: moderateScale(240),
                  height: moderateScale(200),
                }}
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F6F4F0",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default Discount;
