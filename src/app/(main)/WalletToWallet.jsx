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
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { moderateScale } from "react-native-size-matters";
import { transferWalletMoney } from "../services/LoginServices";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const WalletToWallet = () => {
  const { mobile, name } = useLocalSearchParams();
  const [mobileNumber, setMobileNumber] = useState(mobile || "");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
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
        setErrorModal(true);
      }

      setLoading(false);
    } catch (e) {
      setErrorMessage(e?.response?.data?.message || "Something went wrong");
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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setMobileNumber(mobile || "");
      setAmount("");
      setLoading(false);
    }, [mobile])
  );

  return (
    <LinearGradient
      colors={["#00C853", "#1E88E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.mainContainer}>
            <Text style={[styles.title, { textAlign: "center" }]}>
              Wallet-to-Wallet Transfer
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {name ? (
                  <Text style={styles.receiverText}>
                    Receiver: {name}
                    {mobileNumber && mobileNumber.length === 10
                      ? ` (******${mobileNumber.slice(-4)})`
                      : ""}
                  </Text>
                ) : (
                  <>
                    <Text>Mobile Number:</Text>
                    <TextInput
                      placeholder="Enter Mobile Number"
                      style={styles.textInputStyle}
                      value={mobileNumber}
                      onChangeText={handleMobileNumber}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </>
                )}

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

          {/* Error Modal */}
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
                  onPress={() => setErrorModal(false)}
                >
                  <Text style={{ color: "#fff" }}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Success Modal */}
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
                  onPress={() => setSuccessModal(false)}
                >
                  <Text style={{ color: "#fff" }}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  mainContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#fff",
    gap: 10,
    height: height * 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  receiverText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
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
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: "center",
  },
  proceedButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default WalletToWallet;
