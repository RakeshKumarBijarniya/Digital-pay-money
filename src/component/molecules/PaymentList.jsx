import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import { router } from "expo-router";

const PaymentList = () => {
  return (
    <View style={styles.mainContainer}>
      <Text
        style={{
          fontWeight: "600",
          fontSize: 17,
          paddingVertical: 1,
          fontFamily: "SansitaSwashedBold",
        }}
      >
        Payment List
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingVertical: 10,
        }}
      >
        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => router.push("/(main)/Electricity")}
          >
            <Image
              source={require("@/src/assets/images/electricityIcon.png")}
              resizeMode="contain"
              style={{ width: moderateScale(25), height: moderateScale(25) }}
            />
            <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
              Electricity
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <Image
            source={require("@/src/assets/images/internetIcon.png")}
            resizeMode="contain"
            style={{ width: moderateScale(30), height: 30 }}
          />

          <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
            Internet
          </Text>
        </View>
        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <Image
            source={require("@/src/assets/images/voucher.png")}
            resizeMode="contain"
            style={{ width: moderateScale(30), height: 30 }}
          />
          <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
            Voucher
          </Text>
        </View>
        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <Image
            source={require("@/src/assets/images/assurance.png")}
            resizeMode="contain"
            style={{ width: moderateScale(30), height: 30 }}
          />
          <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
            Assurance
          </Text>
        </View>
        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <Image
            source={require("@/src/assets/images/shoppingCartIcon.png")}
            resizeMode="contain"
            style={{ width: moderateScale(30), height: 30 }}
          />
          <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
            Merchant
          </Text>
        </View>
        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <Image
            source={require("@/src/assets/images/MobileCredit.png")}
            resizeMode="contain"
            style={{ width: moderateScale(30), height: 30 }}
          />
          <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
            Mobile Credit
          </Text>
        </View>
        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <Image
            source={require("@/src/assets/images/billIcon (2).png")}
            resizeMode="contain"
            style={{ width: moderateScale(30), height: 30 }}
          />
          <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
            Bill
          </Text>
        </View>
        <View style={{ alignItems: "center", width: "25%", marginTop: 20 }}>
          <Image
            source={require("@/src/assets/images/moreIcon.png")}
            resizeMode="contain"
            style={{ width: moderateScale(30), height: 30 }}
          />
          <Text style={{ fontFamily: "SansitaSwashed", fontSize: 13 }}>
            More
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F6F4F0",
    padding: 10,
    borderRadius: 10,
  },
});

export default PaymentList;
