import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { moderateScale } from "react-native-size-matters";
import { loginServiceApi } from "@/src/app/services/LoginServices";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Login = () => {
  const [password, setPassword] = useState("");
  const [emailORphone, setEmailORPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const storage = Platform.OS === "web" ? global.localStorage : AsyncStorage;

  const handleSignIn = async () => {
    setError("");

    if (!emailORphone.trim()) {
      return setError("*Please Insert Your Phone Number");
    }
    if (!password.trim()) {
      return setError("*Please Insert Your Password");
    }

    setLoading(true);

    try {
      const formData = { emailORphone, password };
      const response = await loginServiceApi(formData);
      setLoading(false);

      if (response.status === 200) {
        const token = response.data.data.token;
        await storage.setItem("token", token);
        const decoded = jwtDecode(token);
        await storage.setItem("myData", JSON.stringify(decoded));

        router.push("/(main)/(tabs)");
      } else {
        setError("*Invalid login credentials");
      }
    } catch (e) {
      setError("Phone Number or Password is Wrong");
      setLoading(false);
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.mainContainer}>
            {/* Logo */}
            <View style={styles.iconContainer}>
              <Image
                style={styles.logoStyle}
                source={require("@/src/assets/images/digitalplay.png")}
              />
            </View>

            {/* Login Form */}
            <View style={styles.loginContainer}>
              <Image
                source={require("@/src/assets/images/userIcon.png")}
                style={styles.userIcon}
              />
              <Text style={styles.title}>Login/Signup Account</Text>

              <TextInput
                placeholder="Enter Your Number"
                style={styles.inputContainer}
                value={emailORphone}
                onChangeText={setEmailORPhone}
              />

              <TextInput
                placeholder="Enter Your Password"
                style={styles.inputContainer}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSignIn}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity>
                <Text style={styles.signupText}>
                  Don't have an account?
                  <Text style={styles.signupLink}> Signup here</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Support Section */}
            <View style={styles.supportContainer}>
              <Text style={styles.supportText}>Support</Text>
              <View style={styles.supportItem}>
                <Image
                  source={require("@/src/assets/images/chat_logo.png")}
                  style={styles.supportIcon}
                />
                <Text style={styles.supportLabel}>Help</Text>
              </View>
              <View style={styles.supportItem}>
                <Image
                  source={require("@/src/assets/images/radio_button.png")}
                  style={styles.supportIcon}
                />
                <Text style={styles.supportLabel}>Privacy Policy</Text>
              </View>
            </View>

            {/* Bottom Branding */}
            <View style={styles.bottomContainer}>
              <Text style={styles.brandingText}>Digital Pay</Text>
              <View style={styles.brandingRow}>
                <Text style={styles.brandingText}>True App</Text>
                <Image
                  source={require("@/src/assets/images/love_logo.png")}
                  style={styles.loveIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logoStyle: {
    width: moderateScale(75),
    height: moderateScale(80),
    resizeMode: "contain",
  },
  loginContainer: {
    borderRadius: 10,
    width: width * 0.95,
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: moderateScale(20),
    marginTop: moderateScale(10),
  },
  userIcon: {
    resizeMode: "contain",
    width: moderateScale(100),
    height: moderateScale(75),
  },
  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: moderateScale(7),
    fontFamily: "SansitaSwashed",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF3F969",
    width: width * 0.9,
    height: moderateScale(50),
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: Platform.OS === "web" ? "rgba(0, 0, 0, 0.2)" : "transparent",

    // iOS Shadow
    shadowColor: "#EEF3F969",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    //Android Shadow
    shadowColor: "#EEF3F969",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 0,
    flex: 1, // Allow input to take up remaining space
    fontSize: Platform.OS === "web" ? 25 : 17, // For Android shadow
  },
  // textInput: {
  //   flex: 1, // Allow input to take up remaining space
  //   fontSize: 17,
  //   color: "#0000008F",
  //   backgroundColor: "trasperent",
  // },
  errorText: {
    color: "red",
    fontSize: 17,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: "#2E5077",
    marginTop: moderateScale(10),
    borderRadius: moderateScale(10),
    width: width * 0.9,
    paddingVertical: moderateScale(10),
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: moderateScale(20),
    fontWeight: "700",
  },
  signupText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  signupLink: {
    fontSize: 15,
    color: "#1A11C3CC",
    opacity: 0.9,
  },
  supportContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  supportText: {
    color: "#F6F4F094",
    fontWeight: "600",
    fontSize: 17,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  supportIcon: {
    width: moderateScale(15),
    height: moderateScale(15),
    resizeMode: "contain",
  },
  supportLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#F6F4F096",
    marginLeft: 20,
  },
  bottomContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  brandingText: {
    color: "#F6F4F04F",
    fontSize: 34,
    fontWeight: "800",
  },
  brandingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loveIcon: {
    width: 40,
    height: 40,
  },
});

export default Login;
