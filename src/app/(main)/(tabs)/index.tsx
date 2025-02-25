import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import PaymentList from "@/src/component/molecules/PaymentList";
import Discount from "@/src/component/molecules/Discount";
import RecentsPay from "@/src/component/molecules/RecentsPay";
import Coupons from "@/src/component/molecules/Coupons";
import LatestArticles from "@/src/component/molecules/LatestArticles";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <LinearGradient
      colors={["#00C853", "#1E88E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={true}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color="#0000ff" />
          ) : (
            <>
              <PaymentList />
              <Discount />
              <RecentsPay />
              <Coupons />
              <LatestArticles />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    //  backgroundColor: "#4B83C3",
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
