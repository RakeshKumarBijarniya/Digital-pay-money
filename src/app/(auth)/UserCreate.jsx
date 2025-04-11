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

const { width, height } = Dimensions.get("window");

import { userReg } from "../services/LoginServices";
import { router, useLocalSearchParams, useRouter } from "expo-router";

import DateTimePicker from "@react-native-community/datetimepicker";
let DatePicker; // Declare DatePicker for web use

if (Platform.OS === "web") {
  import("react-datepicker").then((module) => {
    DatePicker = module.default;
  });
  import("react-datepicker/dist/react-datepicker.css");
}

const UserCreate = () => {
  const [loading, setLoading] = useState(false);
  const [dob, setDob] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [succssModal, setSuccssModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Get email from URL params

  const [formUser, setFormUser] = useState({
    email: email || "",
    name: "",
    phone: "",
    password: "",
    dob: "",
    address: "",
    refrel_code: "",
    kyc_verified: false,
  });
  const handleInputChange = (field, value) => {
    setFormUser((prev) => ({ ...prev, [field]: value }));
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDob(selectedDate);
      setFormUser((prev) => ({
        ...prev,
        dob: selectedDate.toISOString().split("T")[0],
      }));
    }
    setDatePickerVisible(false);
  };
  const sendNewUserData = async () => {
    console.log(formUser);
    if (
      !formUser.email ||
      !formUser.address ||
      !formUser.dob ||
      !formUser.name ||
      !formUser.password ||
      !formUser.phone
    ) {
      setErrorMessage("Please Fill All Fields");
      setErrorModal(true);
      return;
    }
    try {
      setLoading(true);
      const response = await userReg(formUser);
      console.log(response);
      if (response.data.status === "SUCCESS") {
        setSuccessMessage("Registration Successful!");
        setSuccssModal(true);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const navigateToHome = () => {
    setSuccssModal(false);
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
          <ScrollView>
            <View>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                Register
              </Text>
              <View>
                <Text>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="NAME"
                  placeholderTextColor="rgba(0, 0, 0, 0.6)"
                  value={formUser.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                />
              </View>
              <View>
                <Text>Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PHONE"
                  placeholderTextColor="rgba(0, 0, 0, 0.6)"
                  value={formUser.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                />
              </View>
              <View>
                <Text>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PASSWORD"
                  placeholderTextColor="rgba(0, 0, 0, 0.6)"
                  value={formUser.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth</Text>

                {Platform.OS === "web" ? (
                  <View style={styles.datePickerContainer}>
                    <DatePicker
                      selected={dob}
                      onChange={(date) => {
                        setDob(date);
                        setFormUser((prev) => ({
                          ...prev,
                          dob: date ? date.toISOString().split("T")[0] : "",
                        }));
                      }}
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      placeholderText="dd--mm--yyyy"
                      style={{ border: "none" }}
                    />
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={styles.dateButton}
                    >
                      <Text style={styles.dateText}>
                        {dob ? dob.toLocaleDateString("en-GB") : "dd--mm--yyyy"}
                      </Text>
                    </TouchableOpacity>

                    {datePickerVisible && (
                      <DateTimePicker
                        value={dob ? new Date(dob) : new Date()} // Ensures dob is correctly set
                        mode="date"
                        display="default"
                        onChange={onChange}
                        style={styles.datePicker}
                      />
                    )}
                  </>
                )}
              </View>

              <View>
                <Text>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ADDRESS"
                  placeholderTextColor="rgba(0, 0, 0, 0.6)"
                  value={formUser.address}
                  onChangeText={(text) => handleInputChange("address", text)}
                />
              </View>
              <View>
                <Text>refrel_code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Referral Code (Optional)"
                  placeholderTextColor="rgba(0, 0, 0, 0.6)"
                  value={formUser.refrel_code}
                  onChangeText={(text) =>
                    handleInputChange("refrel_code", text)
                  }
                />
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity
                  style={styles.otpSendButton}
                  onPress={sendNewUserData}
                >
                  <Text
                    style={{ fontSize: moderateScale(12), fontWeight: 700 }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              )}

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
          </ScrollView>
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
  datePickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  dateButton: {
    width: "100%",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  datePicker: {
    width: "100%",
  },
});

export default UserCreate;
