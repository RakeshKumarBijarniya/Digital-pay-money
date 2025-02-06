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
} from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { moderateScale } from "react-native-size-matters";
import React, { useState } from "react";
import { loginServiceApi } from "@/src/app/services/LoginServices";
import { router } from "expo-router";

const Login = () => {
  const [password, setPassword] = useState("");
  const [emailORphone, setEmailORPhone] = useState("");
  const [error, setError] = useState("");
  const storage = Platform.OS === "web" ? global.localStorage : AsyncStorage;

  const handleSignIn = async () => {
    setError("");
    try {
      if (!emailORphone.trim()) {
        return setError("*Please Insert Your Phone Number");
      }
      if (!password.trim()) {
        return setError("*Please Insert Your Password");
      }
      const formData = { emailORphone, password };
      const response = await loginServiceApi(formData);
      console.log(response.status);
      if (response.status === 200) {
        const token = response.data.data.token;

        await storage.setItem("token", token);
        const decoded = jwtDecode(token);
        console.log(decoded);
        await storage.setItem("myData", JSON.stringify(decoded));
        router.push("/(main)/(tabs)");
      } else {
        setError("*Invalid login credentials");
      }
    } catch (e) {
      setError("Phone Number or Password is Wrong");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#4B83C3" }}>
      <SafeAreaView>
        <View style={style.mainContainer}>
          <View style={style.iconContainer}>
            <Image
              style={style.logoStyle}
              source={require("@/src/assets/images/digitalplay.png")}
            />
          </View>
          <View style={style.LoginMidContainer}>
            <Image
              source={require("@/src/assets/images/userIcon.png")}
              style={{
                resizeMode: "contain",
                width: moderateScale(100),
                height: moderateScale(75),
                top: moderateScale(5),
              }}
            />
            <View
              style={{
                paddingVertical: moderateScale(5),
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#000",
                  fontSize: 20,
                  fontWeight: "800",
                  textAlign: "center",
                  lineHeight: 24,
                  top: moderateScale(7),
                  fontFamily: "SansitaSwashed",
                }}
              >
                Login/Signup Account
              </Text>
              <TextInput
                placeholder="Enter Your Number"
                style={style.TextInputStyle}
                value={emailORphone}
                onChangeText={(text) => setEmailORPhone(text)}
              />
              <TextInput
                placeholder="Enter Your Password"
                style={style.TextInputStyle}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
              />
              {error ? (
                <Text style={{ color: "red", fontSize: 17, top: 2 }}>
                  {error}
                </Text>
              ) : (
                <Text style={{ height: moderateScale(12) }}></Text>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: "#2E5077",
                  marginTop: moderateScale(10),
                  borderRadius: moderateScale(10),
                }}
                onPress={handleSignIn}
              >
                <Text style={style.loginButton}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={{ fontSize: 18 }}>
                  Don't have an account?{" "}
                  <Text
                    style={{ fontSize: 15, color: "#1A11C3CC", opacity: 0.9 }}
                  >
                    Signup here
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.supportContainer}>
            <Text
              style={{
                color: "#F6F4F094",
                fontWeight: "600",
                fontSize: 17,
                marginLeft: moderateScale(20),
              }}
            >
              Support
            </Text>
            <View
              style={{
                paddingHorizontal: 30,
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <Image
                source={require("@/src/assets/images/chat_logo.png")}
                style={{
                  width: moderateScale(15),
                  height: moderateScale(15),
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  color: "#F6F4F096",
                  marginLeft: 20,
                }}
              >
                Help
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 30,
                flexDirection: "row",
              }}
            >
              <Image
                source={require("@/src/assets/images/radio_button.png")}
                style={{ width: moderateScale(16), height: moderateScale(17) }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  color: "#F6F4F096",
                  marginLeft: 20,
                }}
              >
                Privacy Policy
              </Text>
            </View>
          </View>
          <View style={style.bottomContainer}>
            <Text
              style={{
                color: "#F6F4F04F",
                fontSize: 34,
                fontWeight: "800",
                marginLeft: 20,
              }}
            >
              Digital Pay
            </Text>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "#F6F4F04F",
                    fontSize: 34,
                    fontWeight: "800",
                    marginLeft: 20,
                  }}
                >
                  True App
                </Text>
                <Image
                  source={require("@/src/assets/images/love_logo.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#4B83C3",
    height: "100%",
    paddingBottom: moderateScale(10),
  },
  iconContainer: { justifyContent: "center", alignItems: "center", flex: 1 },
  logoStyle: {
    width: moderateScale(75),
    height: moderateScale(80),
    resizeMode: "contain",
  },
  LoginMidContainer: {
    backgroundColor: "#fff",
    marginHorizontal: moderateScale(25),
    borderRadius: 10,
    flex: 3,
    width: width * 0.95,
    alignSelf: "center",
    top: moderateScale(6),
    paddingBottom: moderateScale(20),
    alignItems: "center",
  },
  supportContainer: {
    left: 10,
    flex: 1,
    paddingVertical: 10,
  },
  bottomContainer: { left: 10, flex: 1 },
  TextInputStyle: {
    backgroundColor: "#1374E321",
    width: width * 0.9,
    height: moderateScale(50),
    paddingHorizontal: 10,
    fontSize: 17,
    textAlign: "center",
    borderRadius: 10,
    marginTop: 10,
    color: "#0000008F",
  },
  loginButton: {
    color: "#fff",
    paddingVertical: moderateScale(5),
    width: width * 0.9,
    fontSize: moderateScale(17),
    fontWeight: "700",
    textAlign: "center",
  },
});

export default Login;
