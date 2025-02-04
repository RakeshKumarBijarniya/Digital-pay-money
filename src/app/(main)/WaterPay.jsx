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
import DropDownPicker from "react-native-dropdown-picker";
import {
  waterBillApi,
  getbillDetails,
  handleSubmitBill,
} from "../services/LoginServices";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const WaterPay = () => {
  const [waterProviders, setWaterProviders] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [rrNumber, setRrNumber] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBillDetails = async () => {
    if (!providerId || !rrNumber.trim()) {
      alert("Please select a provider and enter a valid consumer number");
      return;
    }

    const data = {
      operatorId: providerId,
      canumber: rrNumber,
      mode: "online",
      ad1: "pass value according to operator",
    };
    console.log(data);
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
        BillType: "Water",
        operator: providerId,
        canumber: rrNumber,
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
      console.log(response);
      if (response?.status === "SUCCESS" && response?.data?.status) {
        setSuccessModalShow(true);
        setLoading(false);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await waterBillApi();

      if (!response) {
        alert("Network Error");
        return;
      }
      const filteredProviders = response.data.data.filter(
        (provider) => provider.category === "Water"
      );

      setWaterProviders(
        filteredProviders.map((provider) => ({
          label: provider.name,
          value: provider.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };
  const formattedProviders =
    waterProviders?.map((provider) => ({
      label: provider.name || "Unknown Provider",
      value: provider.id || null,
      key: provider.id || null,
    })) || [];

  useEffect(() => {
    fetchOperators();
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

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={[styles.title, styles.textCenter]}>
          Pay your Water Bill
        </Text>
        <View style={styles.midContainer}>
          <Text style={styles.title}>Water Service Provider</Text>
          <View style={{ gap: moderateScale(30) }}>
            <View style={{ zIndex: open ? 1000 : 1 }}>
              <DropDownPicker
                open={open}
                value={providerId}
                items={waterProviders}
                setOpen={setOpen}
                setValue={setProviderId}
                setItems={setWaterProviders}
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
              <Text style={styles.title}>RR number</Text>
              <TextInput
                style={[styles.textInputStyle, { color: "#000", fontSize: 20 }]}
                value={rrNumber}
                onChangeText={(text) => setRrNumber(text)}
                placeholder="Enter RR Number"
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
                <Text style={styles.modalTitle}>Water Bill Detail</Text>
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
              onPress={handleCancleButton}
            >
              <Text style={{ color: "#fff" }}>Cancel </Text>
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

export default WaterPay;
