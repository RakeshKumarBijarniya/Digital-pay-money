import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../services/ApiServices";
import { moderateScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const WalletTopUp = () => {
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [amount, setAmount] = useState("");
  const [walletModal, setWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const makeOrder = () => {
    if (!amount) {
      Alert.alert("Please Insert Valid Amount");
      return;
    }
    setIsLoading(true);
    createOrder(userData);
    setWalletModal(true);
  };

  const addBalanceSuccessfull = async (paymentResponse) => {
    try {
      setIsLoading(true);
      const successResponse = await fetch(`${baseUrl}/payment-success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentResponse),
      });

      const successData = await successResponse.json();

      if (successData.status === "SUCCESS") {
        Alert.alert("Payment Successful", "Your balance has been added!");
        setAmount("");
        setVisible(false);
      } else {
        Alert.alert("Payment Failed", "Payment verification failed.");
      }
    } catch (error) {
      console.error("Error adding balance:", error);
      Alert.alert("Error", "Failed to update balance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (userParams) => {
    try {
      const response = await fetch(`${baseUrl}/testGetway`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: "receipt#1",
          notes: {},
          user_id: userParams?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const order = await response.json();
      setOrderData(order);
    } catch (error) {
      Alert.alert("Error", "Failed to create Razorpay order");
      console.error("Order Creation Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    setWalletModal(false);
    if (!orderData) {
      Alert.alert("Please wait", "Order is still being created...");
      return;
    }
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("myData");
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
      }
    };
    fetchUserData();
  }, []);

  const toggleModal = () => {
    setWalletModal(!walletModal);
  };

  return (
    <LinearGradient colors={["#00C853", "#1E88E5"]} style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <LottieView
            source={require("@/src/assets/files/waitingLoader.json")}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
          />
        </View>
      )}
      {!visible && !isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View style={styles.inputCard}>
            <Text
              style={{
                fontSize: moderateScale(20),
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Add Your Wallet Balance Here
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
            />
            <TouchableOpacity style={styles.button} onPress={makeOrder}>
              <Text style={styles.buttonText}>Add Cash</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal animationType="fade" transparent={true} visible={walletModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Are you sure you want to add ₹{amount}?
            </Text>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handlePayment}
            >
              <Text style={{ color: "#fff" }}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {visible && userData && orderData && (
        <WebView
          originWhitelist={["*"]}
          source={{
            html: `
            <!DOCTYPE html>
            <html>
              <head>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
              </head>
              <body>
                <script>
                  var options = {
                    key: 'rzp_test_EcEvCLNK9YJdEg',
                    amount: '${Number(amount) * 100}',
                    currency: 'INR',
                    name: 'Digital Pay Money',
                    description: 'Wallet Top-Up',
                    image: 'https://example.com/logo.png',
                    order_id: '${orderData.id}',
                    handler: function (response) {
                      window.ReactNativeWebView.postMessage(JSON.stringify(response));
                    },
                    prefill: {
                      name: '${userData?.name || ""}',
                      email: '${userData?.email || ""}',
                      contact: '${userData?.phone || ""}',
                    },
                    notes: {
                      address: 'Top-up Wallet',
                    },
                    theme: {
                      color: '#F37254',
                    }
                  };
                  var rzp = new Razorpay(options);
                  rzp.open();
                </script>
              </body>
            </html>
          `,
          }}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            addBalanceSuccessfull(data);
          }}
          onNavigationStateChange={(navState) => {
            if (
              navState.url.includes("success") ||
              navState.url.includes("failure")
            ) {
              handleClose();
            }
          }}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: moderateScale(10),
    borderWidth: 1,
    margin: moderateScale(20),
    padding: moderateScale(10),
    gap: moderateScale(30),
    backgroundColor: "#fff",
    flex: 1 / 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#F37254",
    alignItems: "center",
    padding: moderateScale(13),
    borderRadius: moderateScale(10),
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(20),
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  proceedButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
});

export default WalletTopUp;
