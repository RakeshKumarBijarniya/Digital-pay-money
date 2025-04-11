import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import DropDownPicker from "react-native-dropdown-picker";
import { LinearGradient } from "expo-linear-gradient";
import NetInfo from "@react-native-community/netinfo";
import {
  fetchDthApi,
  getBrowserPlan,
  getOperaterOrCricle,
  dthrechargeSumbit,
} from "../services/LoginServices";

const { width } = Dimensions.get("window");

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

  const [loading, setLoading] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showPlan, setShowPlan] = useState([]);

  const checkInternetAndProceed = async (callback) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      Alert.alert(
        "No Internet",
        "Please check your internet connection and try again."
      );
      return;
    }
    callback();
  };
  const checkPlan = (category) => {
    const filteredItem = browsePlans[category];
    setShowPlan(filteredItem);
  };
  const fetchBrowsePlans = async (circleName, operatorName) => {
    checkInternetAndProceed(async () => {
      try {
        const response = await getBrowserPlan({
          circle: circleName,
          op: operatorName,
        });
        console.log(response.data.info);
        setBrowsePlans(response?.data?.info || {});
        setSelectedCategory(null);
      } catch (error) {
        console.error("Error fetching browse plans:", error);
      }
    });
  };

  const handleSubscriberIdChange = async (text) => {
    setSubscriberId(text);
    if (text.length === 10) {
      checkInternetAndProceed(async () => {
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
      });
    } else {
      setOperator("");
      setBrowsePlans({});
    }
  };

  useEffect(() => {
    fetchOperator();
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        alert("No internet connection");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOperator = async () => {
    try {
      const response = await fetchDthApi();
      if (response?.data?.data) {
        const operators = response.data.data.filter(
          (operator) => operator.category === "DTH"
        );
        setDthOperators(
          operators.map((provider) => ({
            label: provider.name,
            value: provider.id,
          }))
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };

  const submitDthData = async () => {
    if (!subscriberId || !selectedOperatorId || !amount) {
      setErrorModal(true);
      setErrorMessage("All fields are required!");
      return;
    }
    try {
      setSubmitLoader(true);
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
      setSubmitLoader(false);
    } catch (e) {
      alert("Something went wrong.");
      setSubmitLoader(false);
    }
  };

  return (
    <LinearGradient colors={["#00C853", "#1E88E5"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: moderateScale(8),
            borderRadius: moderateScale(10),
          }}
        >
          <Text style={{ fontSize: moderateScale(18), fontWeight: 700 }}>
            DTH Recharge
          </Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{ flex: 1 }}
            />
          ) : (
            <FlatList
              data={[{ key: "form" }, { key: "plans" }]}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => {
                if (item.key === "form") {
                  return (
                    <View>
                      <Text style={styles.title}>Operator:</Text>
                      <DropDownPicker
                        open={open}
                        value={selectedOperatorId}
                        items={dthOperators}
                        setOpen={setOpen}
                        setValue={setSelectedOperatorId}
                        setItems={setDthOperators}
                        placeholder="Select Provider"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                      />
                      <Text style={styles.title}>Subscriber ID :</Text>
                      <TextInput
                        style={styles.textInputStyle}
                        value={subscriberId}
                        onChangeText={handleSubscriberIdChange}
                        placeholder="Enter Subscriber ID"
                      />
                      <Text style={styles.title}>Amount:</Text>
                      <TextInput
                        style={styles.textInputStyle}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter Recharge Amount"
                      />
                      {submitLoader ? (
                        <View style={{ marginTop: moderateScale(8) }}>
                          <ActivityIndicator size="large" color="#32a877" />
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.buttonContainer}
                          onPress={submitDthData}
                        >
                          <Text style={{ color: "#fff" }}>Recharge</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                } else if (item.key === "plans") {
                  return browsePlans && Object.keys(browsePlans).length > 0 ? (
                    <View>
                      <View style={styles.planButtonContainer}>
                        {Object.keys(browsePlans).map((subItem, subIndex) => (
                          <TouchableOpacity
                            key={subIndex}
                            style={styles.planDetails}
                            onPress={() => checkPlan(subItem)}
                          >
                            <Text>{subItem}</Text>
                          </TouchableOpacity>
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
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                  }}
                                >
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
                  ) : (
                    <Text style={{ textAlign: "center" }}>
                      No Plans Available
                    </Text>
                  );
                }
              }}
            />
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
                    setSubscriberId("");
                    setSubmitLoader(false);
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default DthRecharge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  mainContainer: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    elevation: 5,
    marginVertical: 20,
  },
  midContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 60,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: moderateScale(10),
  },
  planDetails: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  planButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  planButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 10,
    justifyContent: "center",
  },
  planDetails: {
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 10,
    flexShrink: 0,
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
