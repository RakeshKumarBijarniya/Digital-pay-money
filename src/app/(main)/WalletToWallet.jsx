import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import React, { useEffect, useState, useCallback } from "react";
import { moderateScale } from "react-native-size-matters";
import { transferWalletMoney } from "../services/LoginServices";

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const WalletToWallet = () => {
  const [loading, setLoading] = useState(true);

  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleMobileNumber = (text) => {
    setMobileNumber(text);
  };

  const handleSubmit = async () => {
    if (!amount || !mobileNumber) {
      setErrorMessage("Please fill out all required fields before submitting.");
      setErrorModal(true);
      return;
    }
    if (mobileNumber.length !== 10) {
      setErrorMessage("Please Enter Valid Phone Number");
      setErrorModal(true);
      return;
    }
    setLoading(true);
    try {
      const data = {
        mobileNumber: mobileNumber,
        amount: amount,
      };

      const response = await transferWalletMoney(data);
      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
      } else {
        setErrorMessage(response.response.data.message);
      }
      setLoading(false);
    } catch (e) {
      setErrorMessage(e.response.data.message);
      setErrorModal(true);

      setLoading(false);
    }
  };

  const resetForm = () => {
    setMobileNumber("");
    setAmount("");
  };

  useEffect(() => {
    setLoading(false);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back();
        resetForm();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#00C853", "#1E88E5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, borderRadius: 10 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.mainContainer}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{ justifyContent: "center", alignItems: "center" }}
              />
            ) : (
              <>
                <Text style={[styles.title, { textAlign: "center" }]}>
                  Wallet-to-Wallet Transfer
                </Text>
                <Text>MObile Number:</Text>
                <TextInput
                  placeholder="Enter Mobile Number"
                  style={styles.textInputStyle}
                  value={mobileNumber}
                  onChangeText={handleMobileNumber}
                  keyboardType="numeric"
                  maxLength={10}
                />

                <Text>Amount:</Text>
                <TextInput
                  placeholder="Enter Amount"
                  style={styles.textInputStyle}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={handleSubmit}
                >
                  <Text style={{ color: "#fff" }}>Wallet Transfer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Modal
            animationType="none"
            transparent={true}
            visible={errorModal}
            onRequestClose={() => setErrorModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text>{errorMessage}</Text>
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={() => {
                    setErrorModal(false);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={successModal}
            onRequestClose={() => setSuccessModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text>{successMessage}</Text>
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={() => {
                    setSuccessModal(false);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4B83C3",
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalBackground: {
    flex: 1, // Takes full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },

  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: "center",
  },
  textInputStyle: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(8),
    backgroundColor: "#F6F4F0",
    height: moderateScale(50),
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(13),
  },
  proceedButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  closeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  planDetails: {
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 10,
    flexShrink: 0,
    flexDirection: "column",
  },
  planButtonText: {
    backgroundColor: "#a1d186",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 7,
    fontSize: moderateScale(18),
    color: "#ffff",
    fontWeight: 500,
    alignSelf: "center",
  },
});

export default WalletToWallet;
