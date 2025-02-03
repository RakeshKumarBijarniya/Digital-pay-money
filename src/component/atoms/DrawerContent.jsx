import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { moderateScale } from "react-native-size-matters";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const DrawerContent = ({ ...props }) => {
  const [showWalletService, setShowWalletService] = useState(false);
  const [showMobileItem, setShowMobileItem] = useState(false);
  const [showPayBillItem, setShowBillItem] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("myData");
    router.push("/(auth)");
  };
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ gap: moderateScale(20) }}>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: moderateScale(20) }}
          onPress={() => router.push("/Profile")}
        >
          <Image
            source={require("@/src/assets/images/drawer_user.png")}
            resizeMode="contain"
            style={{ width: moderateScale(18), height: moderateScale(18) }}
          />
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: moderateScale(20) }}
        >
          <Image
            source={require("@/src/assets/images/drawer_history.png")}
            resizeMode="contain"
            style={{
              width: moderateScale(25),
              height: moderateScale(25),
              left: -5,
            }}
          />
          <Text>Transaction History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onPress={() => {
            setShowWalletService(!showWalletService);
          }}
        >
          <View style={{ flexDirection: "row", gap: moderateScale(20) }}>
            <Image
              source={require("@/src/assets/images/drawer_wallet.png")}
              resizeMode="contain"
              style={{ width: moderateScale(18), height: moderateScale(18) }}
            />
            <Text style={{ fontSize: 16 }}>Wallet Services</Text>
          </View>
          <Image
            source={require("@/src/assets/images/drawer_down_select_icon.png")}
          />
        </TouchableOpacity>
        {showWalletService ? (
          <View style={{ gap: 20 }}>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
              onPress={() => router.push("/Profile")}
            >
              <Image
                source={require("@/src/assets/images/drawer_plus_icon.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>Wallet Topup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
            >
              <Image
                source={require("@/src/assets/images/drawer_arrow_icon.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>Wallet To Wallet Transfer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            gap: moderateScale(20),
            justifyContent: "space-between",
          }}
          onPress={() => setShowMobileItem(!showMobileItem)}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", gap: moderateScale(20) }}
          >
            <Image
              source={require("@/src/assets/images/drawer_history.png")}
              resizeMode="contain"
              style={{
                width: moderateScale(25),
                height: moderateScale(25),
                left: -5,
              }}
            />
            <Text>Transaction History</Text>
          </TouchableOpacity>
          <Image
            source={require("@/src/assets/images/drawer_down_select_icon.png")}
          />
        </TouchableOpacity>
        {showMobileItem ? (
          <View style={{ gap: 20 }}>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
              onPress={() => router.push("/Profile")}
            >
              <Image
                source={require("@/src/assets/images/mobile_icon.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>Mobile Recharge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
            >
              <Image
                source={require("@/src/assets/images/Tv.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>DTH Recharge</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            gap: moderateScale(20),
            justifyContent: "space-between",
          }}
          onPress={() => setShowBillItem(!showPayBillItem)}
        >
          <View style={{ flexDirection: "row", gap: moderateScale(20) }}>
            <Image
              source={require("@/src/assets/images/Bill 2.png")}
              resizeMode="contain"
              style={{
                width: moderateScale(22),
                height: moderateScale(22),
              }}
            />
            <Text>Pay Bills</Text>
          </View>
          <Image
            source={require("@/src/assets/images/drawer_down_select_icon.png")}
          />
        </TouchableOpacity>
        {showPayBillItem ? (
          <View style={{ gap: 20 }}>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
              onPress={() => router.push("/(main)/Electricity")}
            >
              <Image
                source={require("@/src/assets/images/electricity.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>Electricty Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
            >
              <Image
                source={require("@/src/assets/images/Waterdrop.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>Water Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
            >
              <Image
                source={require("@/src/assets/images/drawer_bill_icon.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>LTC Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
            >
              <Image
                source={require("@/src/assets/images/drawer_bill_icon.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>LPG Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ left: 20, flexDirection: "row", gap: moderateScale(20) }}
            >
              <Image
                source={require("@/src/assets/images/drawer_bill_icon.png")}
                resizeMode="contain"
                style={{ width: moderateScale(18), height: moderateScale(18) }}
              />
              <Text>Gas Bill</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
