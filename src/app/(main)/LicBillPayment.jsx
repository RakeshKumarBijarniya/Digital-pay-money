import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
//import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import {
  licBillOperator,
  fetchLicBillDetails,
  handleSubmitLicBill,
} from "../services/LoginServices";
import { moderateScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native";
//import DatePicker from "react-native-date-picker";
//   import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css"; // Web Only

//import DateTimePicker from "react-native-date-picker"; // ✅ This fixes the error for mobile
import DateTimePicker from "@react-native-community/datetimepicker";
let DatePicker; // Declare DatePicker for web use

if (Platform.OS === "web") {
  import("react-datepicker").then((module) => {
    DatePicker = module.default;
  });
  import("react-datepicker/dist/react-datepicker.css");
}

const LicBillPayment = () => {
  const [loading, setLoading] = useState(false);
  const [licProviders, setLicProviders] = useState([]);
  const [open, setOpen] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [policyNumber, setPolicyNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const inputRefs = useRef([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(false);

  const submitData = async () => {
    if (!providerId || !policyNumber.trim() || !email.trim() || !dob) {
      setErrorMessage("Please fill in all fields before fetching the bill.");
      setErrorModal(true);
      setLoading(false);
      return;
    }
    try {
      const data = {
        mode: "online",
        canumber: policyNumber,
        ad1: email,
        ad2: dob,
        mode: "online",
      };
      setFetchLoading(true);
      const response = await fetchLicBillDetails(data);
      if (response?.data?.status) {
        setBillDetails({
          customerName: response.data.name,
          dueDate: response.data.duedate,
          billAmount: response.data.amount,
          cellNumber: response.data.bill_fetch.cellNumber,
        });
        setFetchLoading(false);
        setShowModal(true);
        setLoading(false);
      }
    } catch (e) {
      setErrorMessage(e.message || "Something went wrong");
      setErrorModal(true);
    }
  };

  const getCurrentDate = () => {
    try {
      const currentDate = new Date(); // Get the current date
      return `${String(currentDate.getDate()).padStart(2, "0")}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${currentDate.getFullYear()} ${String(
        currentDate.getHours()
      ).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(
        2,
        "0"
      )}:${String(currentDate.getSeconds()).padStart(2, "0")}`;
    } catch (error) {
      console.error("Error generating current date:", error);
      return "00-00-0000 00:00:00"; // Return a fallback date in case of error
    }
  };

  const handlePayBill = async () => {
    if (!billDetails) {
      setErrorMessage(
        "Please fetch the bill details before proceeding to payment."
      );
      setErrorModal(true);
      return;
    }
    setSubmitLoader(true);
    try {
      const data = {
        BillType: "Insurance",
        operator: providerId,
        canumber: policyNumber,
        mode: "online",
        amount: billDetails.billAmount,
        ad1: email,
        ad2: dob,
        latitude: 27.2232,
        longitude: 78.26535,
        bill_fetch: {
          billNumber: "LICI2122000037468013",
          billAmount: billDetails.billAmount,
          billnetamount: billDetails.billAmount,
          billdate: getCurrentDate() || "25-12-2024 12:22:37",
          cellNumber: billDetails.cellNumber,
          dueFrom: billDetails.dueDate,
          dueTo: billDetails.dueDate,
        },
      };

      const response = await handleSubmitLicBill(data);
      if (response?.status === "SUCCESS" && response?.data?.status) {
        let message = "Your payment has been processed successfully.";
        setSuccessMessage(message);
        setSuccessModal(true);
      } else {
        setErrorMessage("Failed to process payment. Please try again.");
        setErrorModal(true);
        setSubmitLoader(false);
      }
    } catch (e) {
      setErrorMessage(e.message || "Something went wrong");
      setErrorModal(true);
    }
  };
  const handleCancleButton = () => {
    setShowModal(false);
    setLoading(false);
    setFetchLoading(false);
    setSuccessModal(false);
    setShowModal(false);

    setSubmitLoader(false);
  };

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const response = await licBillOperator();

      const filteredProviders = response.data.data
        .filter((provider) => provider.category === "Insurance")
        .map((provider) => ({
          label: provider.name,
          value: provider.id,
        }));

      setLicProviders(filteredProviders);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const onChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };
  const handleErrorModal = () => {
    setErrorModal(false);
    setShowModal(false);
    setLoading(false);
    setFetchLoading(false);
    setSuccessModal(false);
    setShowModal(false);
    setSubmitLoader(false);
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
    <LinearGradient colors={["#00C853", "#1E88E5"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Pay Your LIC Bill</Text>
          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <View>
              <View>
                <Text style={styles.label}>Insurance Provider</Text>
                {licProviders.length > 0 ? (
                  <DropDownPicker
                    open={open}
                    value={providerId}
                    items={licProviders}
                    setOpen={setOpen}
                    setValue={setProviderId}
                    setItems={setLicProviders}
                    placeholder="Select Provider"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                  />
                ) : (
                  <Text>Loading Providers...</Text>
                )}
              </View>

              <Text style={styles.label}>Policy Number</Text>
              <TextInput
                style={styles.textInput}
                value={policyNumber}
                onChangeText={setPolicyNumber}
                placeholder="Enter Policy Number"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Date of Birth</Text>

              {Platform.OS === "web" ? (
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    selected={dob}
                    onChange={(date) => setDob(date)}
                    dateFormat="dd-MM-yyyy"
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
                      value={dob || new Date()}
                      mode="date"
                      display="default"
                      onChange={onChange}
                      style={styles.datePicker}
                    />
                  )}
                </>
              )}
              {fetchLoading ? (
                <View style={{ top: moderateScale(10) }}>
                  <ActivityIndicator color="#000" size="large" />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={submitData}
                >
                  <Text style={styles.buttonText}>Fetch Bill</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                {billDetails ? (
                  <View>
                    <Text style={styles.modalTitle}>LIC Bill Details</Text>
                    <Text>Consumer Name : {billDetails.customerName}</Text>
                    <Text>Due Date : {billDetails.dueDate}</Text>
                    <Text>Bill Amount : {billDetails.billAmount}</Text>
                  </View>
                ) : null}

                {submitLoader ? (
                  <View style={{ top: moderateScale(10) }}>
                    <ActivityIndicator color="#000" size="large" />
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={styles.proceedButton}
                      onPress={handlePayBill}
                    >
                      <Text style={{ color: "#fff" }}>Proceed to Pay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleCancleButton}
                    >
                      <Text style={{ color: "#fff" }}>Cancel Payment</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={errorModal}
            onRequestClose={() => setErrorModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text>{errorMessage}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleErrorModal}
                >
                  <Text style={{ color: "#fff" }}>OK </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
                  style={styles.closeButton}
                  onPress={handleErrorModal}
                >
                  <Text style={{ color: "#fff" }}>OK </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  mainContainer: {
    padding: 20,
    backgroundColor: "#F6F4F0",
    borderRadius: 10,
    elevation: 5,
    gap: 10,
    flex: 1,
    margin: moderateScale(10),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  dropdown: { borderColor: "#ccc", borderRadius: 8, height: 50, zIndex: 2000 },
  dropdownContainer: { borderColor: "#ccc", zIndex: 3000 },
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  textInput: {
    borderWidth: 1,
    borderColor: "#000",
    padding: moderateScale(10),
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
  },
  input: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  datePickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  datePicker: {
    width: "100%", // ✅ Ensures DatePicker input field spans full width
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  proceedButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default LicBillPayment;
