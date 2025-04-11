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
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const WaterPay = () => {
  const [waterProviders, setWaterProviders] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [rrNumber, setRrNumber] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkLoader, setCheckLoader] = useState(false);

  const fetchBillDetails = async () => {
    if (!providerId || !rrNumber.trim()) {
      alert("Please select a provider and enter a valid consumer number");
      return;
    }
    try {
      setCheckLoader(true);
      const data = {
        operatorId: providerId,
        canumber: rrNumber,
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
        setCheckLoader(false);
      } else {
        alert("Fetch Failed");
        setCheckLoader(false);
      }
    } catch (e) {
      console.log(e.message);
      setCheckLoader(false);
    }
  };

  const handlePayBill = async () => {
    if (!billDetails) {
      alert("Please fetch the bill details before proceeding to payment.");
      return;
    }
    setShowModal(false);
    try {
      setLoading(true);
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
      console.log("response return", response);
      console.log("response return ggg", response?.data?.status);

      if (response?.status === "SUCCESS") {
        setSuccessModalShow(true);
        setLoading(false);
        setSuccessMessage(response.data.message);
      }
    } catch (e) {
      setErrorMessage(e.response.data.message);
      setErrorModal(true);
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      setFetchLoading(true);
      const response = await waterBillApi();

      if (!response) {
        alert("Network Error");
        setFetchLoading(false);
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
      setFetchLoading(false);
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

  const handleCancleButton = () => {
    setShowModal(false);
    setLoading(false);
  };
  const handleErrorModal = () => {
    setErrorModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setLoading(false);
  };

  return loading ? (
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
          <Text style={[styles.title, styles.textCenter]}>
            Pay your Water Bill
          </Text>
          {fetchLoading ? (
            <View style={{}}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View style={styles.midContainer}>
              <Text style={styles.title}>Water Service Provider</Text>
              <View style={{ gap: moderateScale(30) }}>
                <View>
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
                    style={[
                      styles.textInputStyle,
                      { color: "#000", fontSize: 20 },
                    ]}
                    value={rrNumber}
                    onChangeText={(text) =>
                      setRrNumber(text.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Enter RR Number"
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  {checkLoader ? (
                    <View>
                      <ActivityIndicator size="large" color="blue" />
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

              <Text>{successMessage}</Text>

              <TouchableOpacity
                style={styles.proceedButton}
                onPress={() => {
                  setSuccessModalShow(false);
                  setRrNumber("");
                  setBillDetails(null);
                  setProviderId("");
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

export default WaterPay;
