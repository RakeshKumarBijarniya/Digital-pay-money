import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  lpgGasProvider,
  getLpgBillDetails,
  handleLpgBill,
} from "../services/LoginServices";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const GasPay = () => {
  const [gasProviders, setGasProviders] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [contactNumber, setContactNumber] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentDate = new Date();

  const date = currentDate.toLocaleDateString();

  const fetchBillDetails = async () => {
    if (!providerId || !contactNumber.trim()) {
      alert("Please select a provider and enter a valid bill ID.");
      return;
    }

    const data = {
      operatorId: providerId,
      canumber: contactNumber,
      mode: "online",
      referenceid: "123456",
      latitude: "28.65521",
      longitude: "77.14343",
      ad1: "1",
      ad2: "8",
      ad3: "170",
      ad4: "41013435",
    };

    setLoading(true);
    const response = await getLpgBillDetails(data);
    if (response?.data?.status) {
      setBillDetails({
        consumerName: response.data.name,
        dueDate: response.data.duedate,
        billAmount: response.data.amount,
      });
      setShowModal(true);
      setLoading(false);
    } else {
      alert("Fetch Failed");
    }
  };

  const handlePayBill = async () => {
    if (!billDetails) {
      alert("Please fetch the bill details before proceeding to payment.");
      return;
    }
    setLoading(true);
    setShowModal(false);
    try {
      const data = {
        BillType: "LPG Gas",
        canumber: contactNumber,
        operator: providerId,
        amount: billDetails.billAmount,
        ad1: 22, //Booking Method
        ad2: 458, //Lpg id
        ad3: 16336200, //
        referenceid: "20220114",
      };

      const response = await handleLpgBill(data);
      console.log(response);
      if (response?.status === "SUCCESS" && response?.data?.status) {
        setSuccessModalShow(true);
        setSuccessMessage(response.message);
        setLoading(false);
      }
    } catch (e) {
      setErrorMessage(e.response.data.message);
      setErrorModal(true);
      console.log(e.response.data.message);
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await lpgGasProvider();

      if (!response) {
        alert("Network Error");
        return;
      }
      const filteredProviders = response.data.data.filter(
        (provider) => provider.category === "Gas"
      );

      setGasProviders(
        filteredProviders.map((provider) => ({
          label: provider.name,
          value: provider.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };
  useEffect(() => {
    fetchOperators();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setSubscriberId("");
        router.back();
        return true;
      }
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      router.push("/(main)");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleCancleButton = () => {
    setShowModal(false);
    setLoading(false);
  };
  const handleErrorModal = () => {
    setErrorModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={[styles.title, { textAlign: "center" }]}>
          Your Gas Bill
        </Text>
        <View style={styles.midContainer}>
          <Text style={styles.title}>Gas Service Provider:</Text>
          <View style={{ gap: moderateScale(30) }}>
            <View>
              <DropDownPicker
                open={open}
                value={providerId}
                items={gasProviders}
                setOpen={setOpen}
                setValue={setProviderId}
                setItems={setGasProviders}
                placeholder="Select Provider"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={{
                  fontSize: 18,
                  color: "#000",
                }}
                placeholderStyle={{
                  fontSize: 18,
                  color: "#000",
                }}
              />
            </View>
            <View>
              <Text style={styles.title}>Bill ID:</Text>
              <TextInput
                style={[styles.textInputStyle, { color: "#000", fontSize: 20 }]}
                value={contactNumber}
                onChangeText={(text) => setContactNumber(text)}
                placeholder="Enter Bill ID"
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={fetchBillDetails}
              >
                <Text style={{ color: "#fff" }}>Fetch bill</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

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
                <Text style={styles.modalTitle}>Gas Bill Detail</Text>
                <Text>Consumer Name : {billDetails.consumerName}</Text>
                <Text>Due Date : {billDetails.dueDate}</Text>
                <Text>Bill Amount : {billDetails.billAmount}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handlePayBill}
            >
              <Text style={{ color: "#fff" }}>
                {loading ? "Processing..." : "Proceed to Pay"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCancleButton}
            >
              <Text style={{ color: "#fff" }}>Cancel Payment</Text>
            </TouchableOpacity>
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
              <Text style={{ color: "#fff" }}>Cancel </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalShow}
        onRequestClose={toggleModal}
        // Close the modal on back press
        style={{ backgroundColor: "#fff" }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Payment Successful</Text>
            {/* Your modal content goes here */}
            <Text>{successMessage}</Text>

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={() => {
                setSuccessModalShow(false); // Close modal
                setContactNumber(""); // Reset consumer number input
                setBillDetails(null); // Reset bill details
                setProviderId("");
                // Reset provider selection
              }}
            >
              <Text style={{ color: "#fff" }}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#4B83C3",
  },
  mainContainer: {
    padding: 20,
    backgroundColor: "#F6F4F0",
    borderRadius: 10,
    elevation: 5,
    gap: 10,
    height: height * 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  midContainer: {
    marginTop: 10,
  },
  dropdown: {
    marginBottom: 15,
    backgroundColor: "#4B83C3", // Blue for dropdown button
    borderColor: "#4B83C3",
    borderRadius: 8,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F6F4F0",
    height: 60,
    paddingHorizontal: 10,
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
  proceedButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  dropdownWrapper: {
    position: "relative",
    marginBottom: 20,
    width: "100%",
    zIndex: 1000, // Higher z-index for the dropdown wrapper
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#4B83C3",
  },
  dropdownContainer: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
    backgroundColor: "#4B83C3",
  },
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    zIndex: 1, // Ensure the button has a lower z-index
  },
});

export default GasPay;
