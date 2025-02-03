import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Modal,
} from "react-native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import RNPickerSelect from "react-native-picker-select";
import {
  fetchDthApi,
  getBrowserPlan,
  getOperaterOrCricle,
  dthrechargeSumbit,
} from "../services/LoginServices";

const { width, height } = Dimensions.get("window");

const DthRecharge = () => {
  const [subscriberId, setSubscriberId] = useState("");
  const [operator, setOperator] = useState("");
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [amount, setAmount] = useState("");
  const [dthOperators, setDthOperators] = useState([]);
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
    if (Platform.OS === "web") {
      alert("All fields are required!");
    } else {
      Alert.alert("All fields are required!", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };
  const submitDthData = async () => {
    if (!subscriberId || !operator || !amount) {
      showAlert();
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
      console.log(e.response?.data?.error);
      setErrorModal(true);
      setErrorMessage(e.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchOperator();
  }, []);

  const onOperatorSelect = (id) => {
    const selectedOperator = dthOperators.find((item) => item.id === id);
    if (selectedOperator) {
      setOperator(selectedOperator.id);
      setSelectedOperatorId(selectedOperator.id);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const toggleErrorModal = () => {
    setErrorModal(!errorModal);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.heading}>DTH Recharge</Text>
        <View>
          <Text style={{ fontWeight: "500" }}>Subscriber ID:</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Enter Subscriber ID"
            value={subscriberId}
            onChangeText={(text) => handleSubscriberIdChange(text)}
          />
        </View>
        <View>
          <Text style={{ fontWeight: "500" }}>Operator:</Text>
        </View>
        <RNPickerSelect
          onValueChange={onOperatorSelect}
          items={
            dthOperators.length > 0
              ? dthOperators.map((item, index) => ({
                  label: item.name || "Unknown",
                  value: item.id || `fallback-${index}`,
                }))
              : []
          }
          value={selectedOperatorId || ""}
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

        <View>
          <Text style={{ fontWeight: "500" }}>Amount:</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Enter Amount"
            value={amount}
            onChangeText={(text) => setAmount(text)}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.rechargeButton} onPress={submitDthData}>
          <Text style={{ color: "#fff" }}>Recharge</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            gap: 20,
            flexWrap: "wrap",
            marginTop: moderateScale(20),
            justifyContent: "space-around",
          }}
        >
          {Object.keys(browsePlans).map((category, index) => (
            <TouchableOpacity
              key={`category-${category}-${index}`}
              onPress={() => handleCategoryClick(category)}
            >
              <Text style={styles.planButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.planContainer}>
          {browsePlans[selectedCategory]?.map((plan, index) => (
            <TouchableOpacity
              key={`plan-${selectedCategory}-${index}`}
              style={styles.planDetails}
              onPress={() => setAmount(plan.rs)}
            >
              <Text style={{ fontSize: 18, fontWeight: 700 }}>₹ {plan.rs}</Text>
              <Text style={{ fontSize: 15 }}>
                {plan.desc || "No description available"}
              </Text>
              <Text style={{ fontSize: 18 }}>⏳ Validity: {plan.validity}</Text>
            </TouchableOpacity>
          ))}
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
              <Text style={styles.modalTitle}>Recharge Successful</Text>
              <Text>{successMessage}</Text>

              <TouchableOpacity
                style={styles.proceedButton}
                onPress={toggleModal}
              >
                <Text style={{ color: "#fff", backgroundColor: '"#6624d1"' }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModal}
          onRequestClose={toggleErrorModal}
          style={{ backgroundColor: "#fff" }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Faild</Text>
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
      </ScrollView>
    </View>
  );
};

export default DthRecharge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#4B83C3",
  },
  mainContainer: {
    backgroundColor: "#F6F4F0",
    padding: 5,
    borderRadius: 10,
    boxShadow: "0px 2px 3.5px rgba(0, 0, 0, 0.25)",
    elevation: 5,
    gap: 10,
    height: height * 1,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 20,
    alignSelf: "center",
  },

  inputText: {
    borderRadius: 8,
    borderWidth: 1,
    height: moderateScale(30),
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
  planButton: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
    flexWrap: "wrap",
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
  planContainer: {
    height: 300,
    gap: 20,
    marginTop: 10,
  },
  planDetails: {
    gap: 10,
    flexWrap: "wrap",
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
