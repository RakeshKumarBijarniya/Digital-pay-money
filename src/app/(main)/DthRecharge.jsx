import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  BackHandler,
  KeyboardAvoidingView,
} from "react-native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import DropDownPicker from "react-native-dropdown-picker";
import {
  fetchDthApi,
  getBrowserPlan,
  getOperaterOrCricle,
  dthrechargeSumbit,
} from "../services/LoginServices";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const DthRecharge = () => {
  const [subscriberId, setSubscriberId] = useState("");
  const [operator, setOperator] = useState("");
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [amount, setAmount] = useState("");
  const [dthOperators, setDthOperators] = useState([]);
  const [open, setOpen] = useState(false);
  const [browsePlans, setBrowsePlans] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);

  const fetchBrowsePlans = async (circleName, operatorName) => {
    try {
      const response = await getBrowserPlan({
        circle: circleName,
        op: operatorName,
      });
      setBrowsePlans(response?.data?.info || {});
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error fetching browse plans:", error);
    }
  };

  const handleSubscriberIdChange = async (text) => {
    setSubscriberId(text);
    if (text.length === 10) {
      try {
        const response = await getOperaterOrCricle({ phoneNumber: text });
        if (response?.data?.info) {
          const fetchedOperator = response.data.info.operator;
          const fetchedCircle = response.data.info.circle;
          setOperator(fetchedOperator || "");
          if (fetchedCircle && fetchedOperator) {
            fetchBrowsePlans(fetchedCircle, fetchedOperator);
          }
        }
      } catch (error) {
        console.error("Error fetching operator or circle details:", error);
      }
    } else {
      setOperator("");
      setBrowsePlans({});
    }
  };

  const fetchOperator = async () => {
    const response = await fetchDthApi();
    if (response?.data?.data) {
      const operators = response.data.data.filter(
        (operator) => operator.category === "DTH"
      );
      setDthOperators(operators);
    }
  };

  const showAlert = () => {
    setErrorModal(true);
    setErrorMessage("All Fields Are Required!!!");
  };

  const submitDthData = async () => {
    if (!subscriberId || !selectedOperatorId || !amount) {
      showAlert();
      return;
    }
    try {
      const data = {
        selectedOperatorId,
        subscriberId,
        operator,
        amount,
        rechargeType: "dth",
      };

      const response = await dthrechargeSumbit(data);

      if (response.status) {
        setShowModal(true);
        setSuccessMessage(response.data.message);
      }
    } catch (e) {
      setErrorModal(true);
      setErrorMessage(e.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchOperator();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Clear the subscriberId when back button is pressed
        setSubscriberId("");
        router.back();
        return true; // Prevent default back action (exit app)
      }
    );

    // Return a cleanup function to remove the event listener when the component is unmounted
    return () => {
      backHandler.remove();
    };
  }, []);

  const onOperatorSelect = (id) => {
    const selectedOperator = dthOperators.find((item) => item.id === id);
    if (selectedOperator) {
      setOperator(selectedOperator.id);
      setSelectedOperatorId(selectedOperator.id);
    }
  };

  const toggleModal = () => setShowModal(!showModal);
  const toggleErrorModal = () => setErrorModal(!errorModal);

  const renderPlanButton = (category) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      style={styles.planButton}
    >
      <Text style={styles.planButtonText}>{category}</Text>
    </TouchableOpacity>
  );

  const renderPlanDetails = (plan, index) => (
    <TouchableOpacity
      key={index}
      style={styles.planDetails}
      onPress={() => setAmount(plan.rs)}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>₹ {plan.rs}</Text>
      <Text style={{ fontSize: 15 }}>
        {plan.desc || "No description available"}
      </Text>
      <Text style={{ fontSize: 18 }}>⏳ Validity: {plan.validity}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <FlatList
            ListHeaderComponent={
              <>
                <Text style={styles.heading}>DTH Recharge</Text>
                <View>
                  <Text style={{ fontWeight: "500" }}>Subscriber ID:</Text>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Enter Subscriber ID"
                    value={subscriberId}
                    onChangeText={handleSubscriberIdChange}
                  />
                </View>
                <View style={{ zIndex: 1000 }}>
                  <Text style={{ fontWeight: "500" }}>Operator:</Text>
                  <DropDownPicker
                    open={open}
                    value={selectedOperatorId}
                    items={dthOperators.map((item) => ({
                      label: item.name || "Unknown",
                      value: item.id,
                    }))}
                    setOpen={setOpen}
                    setValue={setSelectedOperatorId}
                    onSelectItem={(item) => onOperatorSelect(item.value)}
                    containerStyle={{ height: 100, marginBottom: 10 }}
                    style={{ backgroundColor: "transparent" }}
                    dropDownStyle={{ backgroundColor: "transparent" }}
                  />
                </View>
                <View>
                  <Text style={{ fontWeight: "500" }}>Amount:</Text>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Enter Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                </View>
                <TouchableOpacity
                  style={styles.rechargeButton}
                  onPress={submitDthData}
                >
                  <Text style={{ color: "#fff" }}>Recharge</Text>
                </TouchableOpacity>
                <View style={styles.planButtonContainer}>
                  {Object.keys(browsePlans).map(renderPlanButton)}
                </View>
              </>
            }
            data={browsePlans[selectedCategory] || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => renderPlanDetails(item, index)}
            ListEmptyComponent={
              <Text style={{ alignSelf: "center", zIndex: 0 }}>
                No Plans Available
              </Text>
            }
          />

          <Modal animationType="slide" transparent visible={showModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Recharge Successful</Text>
                <Text>{successMessage}</Text>
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={toggleModal}
                >
                  <Text style={{ color: "#fff" }}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Error Modal */}
          <Modal animationType="slide" transparent visible={errorModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Failed</Text>
                <Text>{errorMessage}</Text>
                <TouchableOpacity
                  style={[styles.proceedButton, { backgroundColor: "red" }]}
                  onPress={toggleErrorModal}
                >
                  <Text style={{ color: "#fff" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DthRecharge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#4B83C3",
    paddingVertical: 40,
  },
  mainContainer: {
    backgroundColor: "#F6F4F0",
    padding: 5,
    borderRadius: 10,
    boxShadow: "0px 2px 3.5px rgba(0, 0, 0, 0.25)",
    elevation: 5,
    gap: 10,
    height: height * 0.9,
    paddingVertical: 20,
    marginVertical: 20, // Adds space above and below this container
  },
  heading: {
    fontSize: 20,
    alignSelf: "center",
  },

  inputText: {
    borderRadius: 8,
    borderWidth: 1,
    height: moderateScale(45),
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  rechargeButton: {
    backgroundColor: "blue",
    borderRadius: 8,
    height: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  operatorDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  planDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  planButtonText: {
    backgroundColor: "#a1d186",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 7,
    fontSize: moderateScale(18),
    color: "#ffff",
    fontWeight: 500,
    alignSelf: "center",
  },
  planButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 10,
    justifyContent: "center",
  },
  planContainer: {
    height: 300,
    gap: 20,
    marginTop: 10,
  },
  planDetails: {
    gap: 10,
    flexShrink: 0,
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
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
});
