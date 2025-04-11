import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { moderateScale } from "react-native-size-matters";

// import DatePicker from "react-native-date-picker";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css"; // Web Only
const { width, height } = Dimensions.get("window");

import { sendOtp, verifyOtp, userReg } from "../services/LoginServices";
import { router } from "expo-router";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const [formUser, setFormUser] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    dob: "",
    address: "",
    refrel_code: "",
    kyc_verified: false,
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleEmail = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let checkValidEmail = emailRegex.test(email);
    if (!checkValidEmail) {
      setErrorMessage("Please Insert Valid Email Id");
      setErrorModal(true);
      return;
    }
    try {
      const formData = { email };
      setLoading(true);
      const response = await sendOtp(formData);

      if (response?.data?.status === "SUCCESS") {
        setFormUser((prev) => ({ ...prev, ["email"]: email }));
        setShowOtpForm(true);
        setLoading(false);
        setTimer(300);
        setIsResendDisabled(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    const response = await sendOtp({ email });
    if (response?.data?.status === "SUCCESS") {
      setTimer(300);
      setIsResendDisabled(true);
      setOtp(["", "", "", "", "", ""]);
      setLoading(false);
      console.log("OTP Resent!");
    }
  };

  const handleChangeText = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    let otpInString = otp.join("");
    let changeIntoMath = parseInt(otpInString);
    otpInString = changeIntoMath.toString();

    try {
      if (otpInString.length < 6 || otpInString.length > 6) {
        setErrorMessage("Please Insert Valid Otp");
        setErrorModal(true);
        return;
      }
      setVerifyLoading(true);
      const formData = { email, otp: otpInString };

      const response = await verifyOtp(formData);
      if (response?.data?.status === "SUCCESS") {
        router.push({
          pathname: "/(auth)/UserCreate",
          params: { email: email },
        });
      } else {
        errorMessage("Email id is already is used");
        setErrorModal(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#00C853", "#1E88E5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.mainContainer}>
          <Text
            style={{ fontSize: 20, textAlign: "center", fontWeight: "700" }}
          >
            Create Your Account Here
          </Text>
          <View style={styles.inputFieldContainer}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Email Verification
            </Text>

            {!showOtpForm ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                {loading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : (
                  <TouchableOpacity
                    style={styles.otpSendButton}
                    onPress={handleEmail}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: moderateScale(12) }}
                    >
                      Verify Your Email
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                <Text style={styles.title}>Enter Your OTP</Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      style={styles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(text) => handleChangeText(text, index)}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === "Backspace") {
                          handleBackspace(digit, index);
                        }
                      }}
                    />
                  ))}
                </View>
                <Text style={styles.otpText}>
                  OTP Expires in: {formatTime()}
                </Text>
                {verifyLoading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : (
                  <TouchableOpacity style={[styles.resendButton]}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: moderateScale(15),
                        textAlign: "center",
                      }}
                      onPress={handleVerifyOtp}
                    >
                      Verify OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={errorModal}
            onRequestClose={() => setErrorModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text>{errorMessage}</Text>
                <TouchableOpacity onPress={() => setErrorModal(false)}>
                  <Text style={styles.closeButton}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    margin: moderateScale(10),
    borderRadius: 10,
    paddingVertical: moderateScale(40),
    paddingHorizontal: 10,
  },
  inputFieldContainer: {
    flex: 1,
    justifyContent: "center",
    gap: moderateScale(20),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  otpSendButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  otpText: {
    marginTop: 20,
    fontSize: 16,
  },
  resendButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "gray",
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
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  successbutton: {
    backgroundColor: "#04d43c",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default CreateAccount;
