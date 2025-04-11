import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  BackHandler,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ShowBalance from "@/src/component/molecules/ShowBalance";
import PaymentList from "@/src/component/molecules/PaymentList";
import Discount from "@/src/component/molecules/Discount";
import RecentsPay from "@/src/component/molecules/RecentsPay";
import Coupons from "@/src/component/molecules/Coupons";
import LatestArticles from "@/src/component/molecules/LatestArticles";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const router = useRouter();

  // ✅ Check for login data on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem("myData");
        if (!userData) {
          router.replace("/login"); // redirect to login page
        } else {
          // Optional: simulate loading time
          setTimeout(() => setLoading(false), 1000);
        }
      } catch (error) {
        console.error("Error checking user data:", error);
        router.replace("/login");
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      setShowExitModal(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, []);

  const handleExit = () => {
    setShowExitModal(false);
    BackHandler.exitApp();
  };

  const handleCancel = () => {
    setShowExitModal(false);
  };

  return (
    <LinearGradient
      colors={["#00C853", "#1E88E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <ShowBalance />
              <PaymentList />
              <Discount />
              <RecentsPay />
              <Coupons />
              <LatestArticles />
            </>
          )}
        </ScrollView>

        {/* Exit Confirmation Modal */}
        <Modal
          transparent
          visible={showExitModal}
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Are you sure you want to exit?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleExit}
                >
                  <Text style={styles.confirmText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: moderateScale(70),
    paddingHorizontal: 10,
  },
  content: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  cancelText: {
    color: "#1E88E5",
    fontWeight: "bold",
  },
  confirmText: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
});

export default Home;
