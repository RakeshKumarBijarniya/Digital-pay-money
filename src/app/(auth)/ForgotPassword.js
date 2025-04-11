import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { moderateScale } from "react-native-size-matters";
import {
  changePassSendOtp,
  resetPassword,
  forgotverifyOtp,
} from "../services/LoginServices";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");
const ForgotPassword = () => {
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setNewConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [succssModal, setSuccssModal] = useState(false);

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

  const handleEmail = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let checkValidEmail = emailRegex.test(email);

    if (!checkValidEmail) {
      setErrorMessage("Please Insert Valid Email Id");
      setErrorModal(true);
      return;
    }
    setLoading(true);

    const response = await changePassSendOtp({ email });
    if (response.status === "SUCCESS") {
      setShowOtpForm(true);
      setTimer(300);
      setIsResendDisabled(true);
      setLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    let otpInString = otp.join("");
    let changeIntoMath = parseInt(otpInString);
    otpInString = changeIntoMath.toString();
    let formatted = otpInString.toString().padStart(6, "0");
    otpInString = formatted;

    try {
      if (otpInString.length < 6 || otpInString.length > 6) {
        setErrorMessage("Please Insert Valid Otp");
        setErrorModal(true);
        return;
      }
      setVerifyLoading(true);
      const formData = { email, otp: otpInString };

      const response = await forgotverifyOtp(formData);

      if (response.status === "SUCCESS") {
        setShowChangePassword(true);
      } else {
        errorMessage("Please Insert Valid Otp");
        setErrorModal(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const changePasswordHandle = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("New Password & Confirm Password Does Not match!!!");
      setErrorModal(true);
      return;
    }
    const formData = { email, newPassword };
    const response = await resetPassword(formData);
    console.log(response);
    if (response.status === "SUCCESS") {
      setSuccessMessage("Password reset successfully.");
      setSuccssModal(true);
    }
  };

  const navigateToHome = () => {
    setSuccssModal(false);
    setShowOtpForm(false);

    return router.push("/(auth)/Login");
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
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {showChangePassword ? (
              <View>
                <Text style={[styles.title, { textAlign: "center" }]}>
                  Change Your New Password Here
                </Text>
                <View>
                  <Text>New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                  />
                </View>
                <View>
                  <Text>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => setNewConfirmPassword(text)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.otpSendButton}
                  onPress={changePasswordHandle}
                >
                  <Text style={{ color: "#fff", fontSize: moderateScale(12) }}>
                    Change Password
                  </Text>
                </TouchableOpacity>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={succssModal}
                  onRequestClose={() => setSuccssModal(false)}
                >
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                      <Text>{successMessage}</Text>
                      <TouchableOpacity onPress={navigateToHome}>
                        <Text style={styles.successbutton}>Ok</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
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
            ) : (
              <View>
                {!showOtpForm ? (
                  <>
                    <Text style={[styles.title, { textAlign: "center" }]}>
                      Forgot Your Password Here
                    </Text>
                    <Text style={styles.title}>Enter Your Email Here</Text>
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
                          Send OTP
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
  container: {
    flex: 1,
    padding: 20,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    margin: moderateScale(10),
    borderRadius: 10,
    paddingVertical: moderateScale(40),
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
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
});

export default ForgotPassword;
