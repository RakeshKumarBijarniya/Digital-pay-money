import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Text,
  View,
} from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function BarCodeScanner() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [permission, requestPermission] = useCameraPermissions();
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const granted = permission?.granted;
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      const backAction = () => {
        setIsActive(false);
        router.replace("/(main)/WalletToWallet");
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => {
        setIsActive(false);
        backHandler.remove();
      };
    }, [router])
  );

  useEffect(() => {
    if (permission && !granted) {
      requestPermission();
    }
  }, [permission, granted]);

  const extractDetails = (upiUrl) => {
    try {
      const urlParams = new URLSearchParams(upiUrl.split("?")[1]);
      const payeeAddress = urlParams.get("pa");
      const payeeName = urlParams.get("pn");

      let mobileNumber = null;
      if (payeeAddress) {
        const mobileMatch = payeeAddress.match(/\d{10}/);
        mobileNumber = mobileMatch ? mobileMatch[0] : null;
      }

      return { mobileNumber, payeeName, payeeAddress };
    } catch (error) {
      console.error("Error extracting details:", error);
      return { mobileNumber: null, payeeName: null, payeeAddress: null };
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      setErrorMessage("");

      if (data.startsWith("upi://pay")) {
        const { mobileNumber, payeeName, payeeAddress } = extractDetails(data);

        const params = {
          name: payeeName || "Unknown",
          mobile: "",
          upi: payeeAddress || "",
        };

        if (mobileNumber) {
          params.mobile = mobileNumber;
        }

        router.push({
          pathname: "/(main)/WalletToWallet",
          params,
        });
      } else {
        setErrorMessage("Not a valid UPI QR code");
        qrLock.current = false;

        setTimeout(() => {
          setErrorMessage("");
          qrLock.current = false;
        }, 3000);
      }
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Scanner",
          headerShown: false,
        }}
      />

      {isActive && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}

      {errorMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
});
