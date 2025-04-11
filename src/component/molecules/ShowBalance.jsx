import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Corrected Import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { wallet_balance } from "../../app/services/LoginServices"; // Ensure this is correctly implemented
import { moderateScale } from "react-native-size-matters";

const SOCKET_URL = "https://dpm-project-k7na.onrender.com";

const ShowBalance = () => {
  const [balance, setBalance] = useState("Loading...");
  const [showWalletBalance, setShowWalletBalance] = useState(false);

  const fetchWalletBalance = async () => {
    try {
      let data;

      if (Platform.OS === "web") {
        data = global.localStorage.getItem("myData");
      } else {
        data = await AsyncStorage.getItem("myData");
      }

      if (data) {
        const parsedData = JSON.parse(data);

        if (!parsedData?.id) {
          console.log("Invalid ID:", parsedData);
          return;
        }

        const response = await wallet_balance(parsedData.id);
        console.log();
        if (response?.data) {
          setBalance(response?.data[0].balance);
        } else {
          console.log("No balance data found");
        }
      } else {
        console.log("No stored data found");
      }
    } catch (error) {
      console.error("Error retrieving stored data:", error);
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      forceNew: true,
      reconnectionAttempts: 5,
      timeout: 3000,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("fetchWalletBalance", () => {
      console.log("Wallet balance update received");
      fetchWalletBalance();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    socket.on("connect_error", (err) => {
      // console.error(" Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  return (
    <View style={styles.container}>
      <View style={styles.balanceWrapper}>
        <TouchableOpacity
          onPress={() => setShowWalletBalance(!showWalletBalance)}
        >
          <View style={styles.balanceContainer}>
            {showWalletBalance ? (
              <Text style={styles.balanceText}>₹ {balance}</Text>
            ) : (
              <Text style={styles.buttonText}>Show Balance</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShowBalance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: moderateScale(20),
  },
  balanceWrapper: {
    alignSelf: "flex-end",
    height: moderateScale(55),
    width: moderateScale(135),
  },
  balanceContainer: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#2E5077",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceText: {
    fontSize: moderateScale(15),

    color: "white",
  },
  buttonText: {
    fontSize: moderateScale(15),
    color: "#fff",
  },
});
