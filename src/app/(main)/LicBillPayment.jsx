import React, { useEffect, useState } from "react";
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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-date-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { licBillOperator } from "../services/LoginServices";

const LicBillPayment = () => {
  const [loading, setLoading] = useState(false);
  const [licProvider, setLicProvider] = useState([]);
  const [open, setOpen] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [policyNumber, setPolicyNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const response = await licBillOperator();
      console.log("API Response:", response.data);

      const filteredProviders = response.data.data
        .filter((provider) => provider.category === "Insurance")
        .map((provider) => ({
          label: provider.name,
          value: provider.id,
        }));

      console.log("Filtered Providers:", filteredProviders);
      setLicProvider(filteredProviders);
    } catch (e) {
      console.error("Error fetching operators", e);
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
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Pay Your LIC Bill</Text>

          <View style={{ zIndex: 1000 }}>
            <Text style={styles.label}>Insurance Provider</Text>
            {licProvider.length > 0 ? (
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
          <View>
            <TextInput
              style={[styles.textInput, styles.dateInput]}
              value={dob}
              placeholder="DD/MM/YYYY"
              editable={false}
            />
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <Ionicons name="calendar-outline" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          <DatePicker
            modal
            open={datePickerOpen}
            date={new Date()}
            mode="date"
            onConfirm={(selectedDate) => {
              setDatePickerOpen(false);
              let formattedDate = selectedDate.toISOString().split("T")[0];
              setDob(formattedDate);
            }}
            onCancel={() => setDatePickerOpen(false)}
          />

          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Fetch Bill</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#4B83C3" },
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
});

export default LicBillPayment;
