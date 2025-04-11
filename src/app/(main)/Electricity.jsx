import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";

import DropDownPicker from "react-native-dropdown-picker";
import { moderateScale } from "react-native-size-matters";
import {
  electricityApi,
  getbillDetails,
  handleSubmitBill,
} from "../services/LoginServices";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const Electricity = () => {
  const [electricityProviders, setElectricityProviders] = useState([]);

  const [consumerNumber, setConsumerNumber] = useState("");
  const [providerId, setProviderId] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successModalShow, setsuccessModalShow] = useState(false);
  const [processLoader, setProcessLoader] = useState(false);

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);

  const fetchBillDetails = async () => {
    if (!providerId || !consumerNumber.trim()) {
      Alert.alert("Please select a provider and enter a valid consumer number");
      return;
    }
    try {
      setFetchLoader(true);
      const data = {
        operatorId: providerId,
        canumber: consumerNumber,
        mode: "online",
        ad1: "pass value according to operator",
      };
      const response = await getbillDetails(data);
      console.log(response);
      if (response?.data?.status) {
        setBillDetails({
          consumerName: response.data.name,
          dueDate: response.data.duedate,
          billAmount: response.data.amount,
        });
        setShowModal(true);
        setFetchLoader(false);
      } else {
        alert("Fetch Failed");
        setFetchLoader(false);
      }
    } catch (e) {
      console.log(e.message);
      setFetchLoader(false);
    }
  };

  const handlePayBill = async () => {
    if (!billDetails) {
      alert("Please fetch the bill details before proceeding to payment.");
      return;
    }
    setShowModal(false);

    try {
      setProcessLoader(true);
      const data = {
        BillType: "Electricity",
        operator: providerId,
        canumber: consumerNumber,
        amount: billDetails.billAmount,
        referenceid: "20018575947",
        latitude: "27.2232",
        longitude: "78.26535",
        mode: "online",
        bill_fetch: {
          billAmount: billDetails.billAmount,
          billnetamount: billDetails.billAmount,
          billdate: "01Jan1990",
          dueDate: billDetails.dueDate,
          cellNumber: "102277100",
          userName: billDetails.consumerName,
        },
      };
      const response = await handleSubmitBill(data);

      if (response?.status === "SUCCESS" && response?.data?.status) {
        setsuccessModalShow(true);
        setProcessLoader(false);
      }
    } catch (e) {
      console.log(e.message);
      setProcessLoader(false);
    }
  };

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const response = await electricityApi();

      if (!response) {
        alert("Network Error");
        return;
      }
      const filteredProviders = response.data.data.filter(
        (provider) => provider.category === "Electricity"
      );

      setElectricityProviders(
        filteredProviders.map((provider) => ({
          label: provider.name,
          value: provider.id,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching operators:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
    setProcessLoader(false);
  };

  // const formattedProviders = electricityProviders.map((provider, ind) => ({
  //   label: provider.name,
  //   value: provider.id,
  //   index: ind,
  // }));

  return processLoader ? (
    <View style={styles.loaderContainer}>
      <LottieView
        source={require("@/src/assets/files/waitingLoader.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
    </View>
  ) : (
    <LinearGradient
      colors={["#00C853", "#1E88E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <Text style={[styles.title, { textAlign: "center" }]}>
            Pay Your Electricity Bill
          </Text>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={styles.midContainer}>
              <Text style={styles.title}>Electricity Service Provider:</Text>
              <View style={{ gap: moderateScale(30) }}>
                <View>
                  <DropDownPicker
                    open={open}
                    value={providerId}
                    items={electricityProviders}
                    setOpen={setOpen}
                    setValue={setProviderId}
                    setItems={setElectricityProviders}
                    placeholder="Select Provider"
                    style={styles.dropdown}
                    dropDownContainerStyle={{
                      maxHeight: 200,
                      borderColor: "#ccc",
                      backgroundColor: "#fff",
                    }}
                    textStyle={{ fontSize: 18, color: "#000" }}
                    placeholderStyle={{ fontSize: 18, color: "#000" }}
                  />
                </View>

                <View>
                  <Text style={styles.title}>Consumer Number:</Text>
                  <TextInput
                    style={[
                      styles.textInputStyle,
                      { color: "#000", fontSize: 20 },
                    ]}
                    value={consumerNumber}
                    onChangeText={setConsumerNumber}
                    placeholder="Enter Consumer Number"
                  />
                </View>
                <View>
                  {fetchLoader ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={fetchBillDetails}
                    >
                      <Text style={{ color: "#fff" }}>Fetch bill</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={toggleModal}
          style={{ backgroundColor: "#fff" }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Electricity Bill detail</Text>
              {billDetails && (
                <>
                  <Text>Consumer Name : {billDetails.consumerName}</Text>
                  <Text>Consumer Name : {billDetails.dueDate}</Text>
                  <Text>Bill Amount : {billDetails.billAmount}</Text>
                </>
              )}

              <View>
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={handlePayBill}
                >
                  <Text style={{ color: "#fff" }}>Proceed to Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={toggleModal}
                >
                  <Text style={{ color: "#fff" }}>Cancel Payment</Text>
                </TouchableOpacity>
              </View>
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
              <Text>Your payment has been processed successfully.</Text>

              <TouchableOpacity
                style={styles.proceedButton}
                onPress={() => {
                  setsuccessModalShow(false); // Close modal
                  setConsumerNumber(""); // Reset consumer number input
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
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
    marginBottom: 15,
    backgroundColor: "#fff", // Blue for dropdown button
    borderColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    zIndex: 1, // Ensure the button has a lower z-index
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
});

export default Electricity;
