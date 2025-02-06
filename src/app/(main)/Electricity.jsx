import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Modal,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  electricityApi,
  getbillDetails,
  handleSubmitBill,
} from "../services/LoginServices";
import { router } from "expo-router";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Electricity = () => {
  const [electricityProviders, setElectricityProviders] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [providerId, setProviderId] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [successModalShow, setsuccessModalShow] = useState(false);

  const fetchBillDetails = async () => {
    if (!providerId || !consumerNumber.trim()) {
      alert("Please select a provider and enter a valid consumer number");
      return;
    }

    const data = {
      operatorId: providerId,
      canumber: consumerNumber,
      mode: "online",
      ad1: "pass value according to operator",
    };
    const response = await getbillDetails(data);
    if (response?.data?.status) {
      setBillDetails({
        consumerName: response.data.name,
        dueDate: response.data.duedate,
        billAmount: response.data.amount,
      });
      setShowModal(true);
    } else {
      alert("Fetch Failed");
    }
  };

  const handlePayBill = async () => {
    setLoading(true);
    if (!billDetails) {
      alert("Please fetch the bill details before proceeding to payment.");
      return;
    }
    setShowModal(false);
    try {
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
        setLoading(false);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await electricityApi();

      if (!response) {
        alert("Network Error");
        return;
      }
      const filteredProviders = response.data.data.filter(
        (provider) => provider.category === "Electricity"
      );

      setElectricityProviders(filteredProviders);

      if (filteredProviders.length > 0) {
        setProviderName("Select Provider");
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
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
  };

  const formattedProviders = electricityProviders.map((provider, ind) => ({
    label: provider.name,
    value: provider.id,
    index: ind,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={[styles.title, styles.textCenter]}>
          Pay your electricity Bill
        </Text>
        <View style={styles.midContainer}>
          <Text style={styles.title}>Electricity Service Provider</Text>
          {electricityProviders.length > 0 ? (
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  const selectedProvider = electricityProviders.find(
                    (provider) => provider.id === value
                  );
                  if (selectedProvider) {
                    setProviderName(selectedProvider.name);
                    setProviderId(selectedProvider.id);
                  } else {
                    setProviderName("");
                    setProviderId("");
                  }
                }}
                items={formattedProviders}
                value={providerId || ""}
                placeholder={{
                  label: providerName || "Select Provider",
                  value: "",
                }}
                style={{
                  inputAndroid: {
                    fontSize: 18,
                    height: 60,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    textAlign: "center",
                  },
                  inputIOS: {
                    fontSize: 18,
                    height: 60,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    textAlign: "center",
                  },
                  inputWeb: {
                    fontSize: 18,
                    height: 60,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    textAlign: "center",
                  },
                  placeholder: {
                    color: "black",
                    fontSize: 18,
                  },
                }}
              />
            </View>
          ) : (
            <Text>Network issue</Text>
          )}

          <View>
            <Text style={styles.title}>Consumer number</Text>
            <TextInput
              style={[styles.textInputStyle, { color: "#000", fontSize: 20 }]}
              value={consumerNumber}
              onChangeText={(text) => setConsumerNumber(text)}
              placeholder="Enter Consumer number"
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={fetchBillDetails}
        >
          <Text style={{ color: "#fff" }}>Fetch bill</Text>
        </TouchableOpacity>
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
            <Text>Consumer Name : Dummy Name</Text>
            <Text>Consumer Name : 31-01-25</Text>
            <Text>Bill Amount : 3000 INR</Text>

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handlePayBill}
            >
              <Text style={{ color: "#fff" }}>
                {loading ? "Processing..." : "Proceed to Pay"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={{ color: "#fff" }}>Cancel Payment</Text>
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
    boxShadow: "0px 2px 3.5px rgba(0, 0, 0, 0.25)",
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "transparent",
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
  },
  pickerInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "transparent",
    textAlign: "center",
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F6F4F0",
    overflow: "hidden",
    height: 60,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: "#000",
    fontSize: 20,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  textCenter: {
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
  },
  modalContainer: {
    backgroundColor: "#FFF", // White background color for the modal
    padding: 20,
    borderRadius: 10,
    width: width * 0.8, // Adjust width as needed
    alignItems: "center", // Center align the content inside the modal
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
});

export default Electricity;
