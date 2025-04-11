import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import React, { useEffect, useState, useCallback } from "react";
import { moderateScale } from "react-native-size-matters";
import {
  moblieOperator,
  getOperaterOrCricle,
  getBrowserPlan,
  mobileRechargeSubmit,
} from "../services/LoginServices";
import { debounce } from "lodash";
import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

const MobileRecharge = () => {
  const [showModal, setShowModal] = useState(false);
  const [operator, setOperator] = useState("");
  const [operatorId, setOperatorId] = useState(null);
  const [prepaidOperators, setPrepaidOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [browsePlans, setBrowsePlans] = useState({});
  const [circle, setCircle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [showPlan, setShowPlan] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchOperatorAndCircle = useCallback(
    debounce(async (text, prepaidOperators) => {
      try {
        const response = await getOperaterOrCricle({ phoneNumber: text });
        if (response?.data?.info) {
          const fetchedOperator = response.data.info.operator;
          const fetchedCircle = response.data.info.circle;

          const matchedOperator = prepaidOperators.find(
            (op) => op.name === fetchedOperator
          );

          setOperator(fetchedOperator || "");
          setOperatorId(matchedOperator?.id || "");
          setCircle(fetchedCircle || "");

          if (fetchedCircle && fetchedOperator) {
            fetchBrowsePlans(fetchedCircle, fetchedOperator);
          }
        }
      } catch (error) {
        console.error("Error fetching operator or circle details:", error);
      }
    }, 500),
    []
  );
  const fetchBrowsePlans = async (circleName, operatorName) => {
    try {
      const response = await getBrowserPlan({
        circle: circleName,
        op: operatorName,
      });

      setBrowsePlans(response?.data?.info || {});
    } catch (error) {
      console.error("Error fetching browse plans:", error);
    }
  };

  const handleSubscriberIdChange = (text) => {
    setPhoneNumber(text);

    if (text.length === 10) {
      fetchOperatorAndCircle(text, prepaidOperators);
    } else {
      setOperator("");
      setCircle("");
      setBrowsePlans({});
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !operator || !amount || !operatorId) {
      setErrorMessage("All fields are required!");
      setErrorModal(true);
      return;
    }

    try {
      const data = {
        phoneNumber: parseInt(phoneNumber),
        operator: operator,
        amount: parseInt(amount),
        operatorId: parseInt(operatorId),
      };
      setFetchLoading(true);
      const response = await mobileRechargeSubmit(data);
      setFetchLoading(false);
      if (response.data.status) {
        setSuccessMessage(response.data.message);
        setShowModal(true);
      }
    } catch (e) {
      console.log(e.response.data.message);
      setErrorMessage(e.response.data.message);
      setErrorModal(true);
      setFetchLoading(false);
    }
  };
  const checkPlan = (category) => {
    const filteredItem = browsePlans[category];
    setShowPlan(filteredItem);
  };

  const fetchOperator = async () => {
    const response = await moblieOperator();

    if (response?.data?.data) {
      const operators = response.data.data.filter(
        (operator) => operator.category === "Prepaid"
      );

      setPrepaidOperators(operators);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setPhoneNumber("");
    setCircle("");
    setOperator("");
    setBrowsePlans({});
    setShowPlan([]);
  };

  useEffect(() => {
    fetchOperator();
    setLoading(true);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back();
        resetForm();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <LinearGradient
      colors={["#00C853", "#1E88E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E88E5" />
              </View>
            ) : (
              <>
                <Text style={[styles.title, { textAlign: "center" }]}>
                  Mobile Recharge
                </Text>
                <Text>Phone Number:</Text>
                <TextInput
                  placeholder="Enter Phone Number"
                  style={styles.textInputStyle}
                  value={phoneNumber}
                  onChangeText={handleSubscriberIdChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Text>Operator:</Text>
                <TextInput
                  placeholder="Operator"
                  style={styles.textInputStyle}
                  value={operator}
                  editable={false}
                />
                <Text>Circle:</Text>
                <TextInput
                  placeholder="Circle"
                  style={styles.textInputStyle}
                  value={circle}
                  editable={false}
                />
                <Text>Amount:</Text>
                <TextInput
                  placeholder="Enter Amount"
                  style={styles.textInputStyle}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
                {fetchLoading ? (
                  <ActivityIndicator size="large" color="#1E88E5" />
                ) : (
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={handleSubmit}
                  >
                    <Text style={{ color: "#fff" }}>Recharge</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {browsePlans && Object.keys(browsePlans).length > 0 ? (
              <View>
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      margin: 10,
                      fontSize: moderateScale(15),
                    }}
                  >
                    📋 Available Plans
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: moderateScale(15),
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {Object.keys(browsePlans).map((category, index) => (
                      <View key={index} style={styles.planDetails}>
                        <TouchableOpacity>
                          <Text
                            style={styles.planButtonText}
                            onPress={() => checkPlan(category)}
                          >
                            {category}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  {showPlan ? (
                    <View>
                      {showPlan.map((plan, index) => (
                        <View key={index}>
                          <TouchableOpacity
                            key={index}
                            style={styles.planDetails}
                            onPress={() => setAmount(plan.rs)}
                          >
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                              ₹ {plan.rs}
                            </Text>
                            <Text style={{ fontSize: 15 }}>
                              {plan.desc || "No description available"}
                            </Text>
                            <Text style={{ fontSize: 18 }}>
                              ⏳ Validity: {plan.validity}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              </View>
            ) : (
              <View>
                <Text>No Plans Available</Text>
              </View>
            )}
            <Modal
              animationType="none"
              transparent={true}
              visible={errorModal}
              onRequestClose={() => setErrorModal(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text>{errorMessage}</Text>
                  <TouchableOpacity
                    style={styles.proceedButton}
                    onPress={() => {
                      setErrorModal(false);
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="fade"
              transparent={true}
              onRequestClose={() => setShowModal(false)}
              visible={showModal}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text>{successMessage}</Text>
                  <TouchableOpacity
                    style={styles.proceedButton}
                    onPress={() => {
                      setShowModal(false);
                      setAmount("");
                      setPhoneNumber("");
                      setCircle("");
                      setOperator("");
                      setBrowsePlans({});
                      setShowPlan([]);
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    gap: 10,
  },
  loadingContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
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
  textInputStyle: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(8),
    backgroundColor: "#F6F4F0",
    height: moderateScale(50),
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(13),
  },
  proceedButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  closeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  planDetails: {
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 10,
    flexShrink: 0,
    flexDirection: "column",
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
});

export default MobileRecharge;
