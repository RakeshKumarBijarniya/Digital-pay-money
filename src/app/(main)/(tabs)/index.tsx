import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale } from "react-native-size-matters";
import PaymentList from "@/src/component/molecules/PaymentList";
import Discount from "@/src/component/molecules/Discount";
import RecentsPay from "@/src/component/molecules/RecentsPay";
import Coupons from "@/src/component/molecules/Coupons";
import LatestArticles from "@/src/component/molecules/LatestArticles";

const Home = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        <PaymentList />
        <Discount />
        <RecentsPay />
        <Coupons />
        <LatestArticles />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#4B83C3",
    height: "100%",
    paddingVertical: 10,
    flex: 1,
    paddingTop: moderateScale(70),
    paddingHorizontal: 10,
  },
  content: {
    padding: 0,
    // to make scrollable
  },
  text: {
    fontSize: 100,
  },
});

export default Home;
