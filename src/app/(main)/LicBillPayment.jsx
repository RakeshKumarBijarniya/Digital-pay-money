import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  licBillOperator,
  fetchLicBillDetails,
  handleSubmitLicBill,
} from "../services/LoginServices";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-date-picker"; // ✅ Import Date Picker
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Import Icons
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const LicBillPayment = () => {
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [licProvider, setLicProvider] = useState([]);
  const [open, setOpen] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [PolicyNumber, setPolicyNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [validation, setValidation] = useState(false);
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const response = await licBillOperator();
      const filteredProviders = response.data.data.filter(
        (provider) => provider.category === "Insurance"
      );
      setLicProvider(
        filteredProviders.map((provider) => ({
          label: provider.name,
          value: provider.id,
        }))
      );
    } catch (e) {
      console.log("Error fetching operators", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        ListHeaderComponent={
          <View style={styles.mainContainer}>
            <Text style={styles.title}>Pay Your LIC Bill</Text>
            <Text style={{ fontSize: 16 }}>Insurance Provider</Text>
            <DropDownPicker
              open={open}
              value={providerId}
              items={licProvider}
              setOpen={setOpen}
              setValue={setProviderId}
              setItems={setLicProvider}
              placeholder="Select Provider"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <Text style={{ fontSize: 16 }}>Policy number</Text>
            <TextInput
              style={styles.textInput}
              value={PolicyNumber}
              onChangeText={setPolicyNumber}
              placeholder="Enter Policy Number"
            />
            <Text style={{ fontSize: 16 }}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={{ fontSize: 16 }}>Date of birth</Text>

            <View>
              <Text style={styles.title}>Date of Birth:</Text>

              {/* ✅ Web: Show HTML Date Input */}
              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={styles.webDateInput} // ✅ Styling for Web Date Input
                />
              ) : (
                // ✅ Mobile: Show React Native Date Picker
                <View style={styles.dateInputContainer}>
                  <TextInput
                    style={[styles.textInputStyle, styles.dateInput]}
                    value={dob}
                    placeholder="DD/MM/YYYY"
                    editable={false} // Prevent manual input
                  />
                  <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                    <Ionicons name="calendar-outline" size={30} color="#000" />
                  </TouchableOpacity>
                </View>
              )}

              {/* ✅ Mobile Date Picker */}
              {Platform.OS !== "web" && (
                <DatePicker
                  modal
                  open={datePickerOpen}
                  date={new Date()}
                  mode="date"
                  onConfirm={(selectedDate) => {
                    setDatePickerOpen(false);
                    let formattedDate = selectedDate
                      .toISOString()
                      .split("T")[0]; // Convert to YYYY-MM-DD
                    setDob(formattedDate);
                  }}
                  onCancel={() => setDatePickerOpen(false)}
                />
              )}
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttonContainer}
                //onPress={fetchBillDetails}
              >
                <Text style={{ color: "#fff" }}>Fetch bill</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
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
    padding: 20,
    backgroundColor: "#F6F4F0",
    borderRadius: 10,
    elevation: 5,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F6F4F0",
    height: 50,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    height: 50,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "blue",
    height: 60,
    paddingHorizontal: 20,
  },
  dateInput: {
    paddingHorizontal: 10,
    flex: 1,
  },
  webDateInput: {
    width: "100%",
    height: 60,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 18,
    left: 20,
  },
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
});

export default LicBillPayment;
