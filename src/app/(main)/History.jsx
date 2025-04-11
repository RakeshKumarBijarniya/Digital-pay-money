import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { io } from "socket.io-client";

const SOCKET_URL = "https://dpm-project-k7na.onrender.com";
import { moderateScale } from "react-native-size-matters";
import {
  getBillTransiton,
  getMobileTransaction,
  getTransHistory,
} from "../services/LoginServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const NewHistory = () => {
  const [loading, setLoading] = useState(true);
  const [moneyTransData, setMoneyTransData] = useState(null);
  const [billHistoryData, setBillHistoryData] = useState([]);
  const [mobileHistoryData, setMobileHistoryData] = useState([]);
  const [showFilterItem, setShowFilterItem] = useState(false);
  const [showMoneyHistory, setShowMoneyHistory] = useState(true);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [showBillHistory, setShowBillHistory] = useState(false);

  const getStoredData = async () => {
    try {
      let data;
      if (Platform.OS === "web") {
        data = await global.localStorage.getItem("myData");
      } else {
        data = await AsyncStorage.getItem("myData");
      }

      if (data) {
        const parsedData = JSON.parse(data);
        if (!parsedData?.id) {
          console.log("Invalid ID:", parsedData);
          return;
        }

        console.log("User ID:", parsedData.id);
        fetchHistoryData(parsedData.id);
        fetchMobileHistoryData(parsedData.id);
        getBillHistoryData(parsedData.id);
      } else {
        console.log("No stored data found");
      }
    } catch (error) {
      console.error("Error retrieving stored data:", error);
    }
  };

  const fetchHistoryData = async (userId) => {
    try {
      if (!userId) return;
      const response = await getTransHistory(userId);
      if (response.data) {
        setMoneyTransData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMobileHistoryData = async (userId) => {
    try {
      if (!userId) return;
      const response = await getMobileTransaction(userId);
      if (response.data) {
        setMobileHistoryData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getBillHistoryData = async (userId) => {
    try {
      if (!userId) return;
      const response = await getBillTransiton(userId);
      if (response.data) {
        setBillHistoryData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getStoredData();
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

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("fetchTransHistory", async () => {
      try {
        let storedData;
        if (Platform.OS === "web") {
          storedData = global.localStorage.getItem("myData");
        } else {
          storedData = await AsyncStorage.getItem("myData");
        }

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const userId = parsedData.id;

          if (!userId) {
            console.log("Invalid ID in socket refresh:", parsedData);
            return;
          }

          fetchHistoryData(userId);
          fetchMobileHistoryData(userId);
          getBillHistoryData(userId);
        }
      } catch (err) {
        console.error("Socket fetch error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(" Disconnected from Socket.IO server");
    });

    socket.on("connect_error", (err) => {
      console.error(" Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const changeShowHistory = (type) => {
    setShowFilterItem(false);
    setShowMoneyHistory(type === "moneyTransData");
    setShowBillHistory(type === "billTransData");
    setShowMobileHistory(type === "mobileHistory");
  };

  return loading ? (
    <LinearGradient
      colors={["#00C853", "#1E88E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <ActivityIndicator size="large" color="#0000ff" />
    </LinearGradient>
  ) : (
    <LinearGradient
      colors={["#00C853", "#1E88E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <Text style={{ fontSize: moderateScale(15), fontWeight: 500 }}>
                {showMoneyHistory
                  ? "Money Transactions History"
                  : showMobileHistory
                  ? "Mobile Recharge History"
                  : showBillHistory
                  ? "Bill Payment History"
                  : ""}
              </Text>

              <TouchableOpacity
                onPress={() => setShowFilterItem(!showFilterItem)}
              >
                <Image
                  source={require("@/src/assets/images/filterIcon.png")}
                  resizeMode="contain"
                  style={{ width: moderateScale(20), height: 20 }}
                />
              </TouchableOpacity>
            </View>

            {showFilterItem && (
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  onPress={() => changeShowHistory("moneyTransData")}
                >
                  <Text style={styles.filterItem}>
                    Money Transactions History
                  </Text>
                </TouchableOpacity>

                <View style={styles.separator} />
                <TouchableOpacity
                  onPress={() => changeShowHistory("billTransData")}
                >
                  <Text style={styles.filterItem}>
                    Bill Transactions History
                  </Text>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity
                  onPress={() => changeShowHistory("mobileHistory")}
                >
                  <Text style={styles.filterItem}>
                    Mobile Transactions History
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.separator} />

            {showMoneyHistory && (
              <View>
                {moneyTransData?.map((item) => (
                  <View key={item.id.toString()} style={styles.row}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: moderateScale(30),
                          height: moderateScale(30),
                          backgroundColor: "#a8a832",
                          borderRadius: moderateScale(15),
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={[{ color: "#fff", flex: 1 }, styles.cell]}>
                          {item.receiver_name &&
                            item.receiver_name
                              .split(" ")
                              .map((word) => word.slice(0, 1))
                              .join("")
                              .slice(0, 2)}
                        </Text>
                      </View>
                      <View style={{ alignItems: "center", flex: 1 }}>
                        <Text style={styles.cell}>{item.receiver_name}</Text>
                        <Text style={[styles.cell, { opacity: 0.5 }]}>
                          {item.created_at.split("T")[0]}
                        </Text>
                      </View>

                      <Text
                        style={[styles.cell, { flex: 1, textAlign: "right" }]}
                      >
                        {item.amount}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {showBillHistory && (
              <View>
                {billHistoryData
                  ?.slice()
                  .reverse()
                  .map((item) => (
                    <View key={item.id.toString()} style={styles.row}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ alignItems: "flex-start", flex: 1 }}>
                          <Text style={styles.cell}>{item.recharge_type}</Text>
                          <Text style={[styles.cell, { opacity: 0.5 }]}>
                            {item.created_at.split("T")[0]}
                          </Text>
                        </View>
                        <Text>{item.status}</Text>

                        <Text
                          style={[styles.cell, { flex: 1, textAlign: "right" }]}
                        >
                          {item.amount}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {showMobileHistory && (
              <View>
                {mobileHistoryData
                  ?.slice()
                  .reverse()
                  .map((item) => (
                    <View key={item.id.toString()} style={styles.row}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ alignItems: "flex-start", flex: 1 }}>
                          <Text style={styles.cell}>{item.number}</Text>
                          <Text style={[styles.cell, { opacity: 0.5 }]}>
                            {item.created_at.split("T")[0]}
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontWeight: 500 }}>
                            {item.recharge_type} Recharge
                          </Text>
                          <Text>{item.recharge_status}</Text>
                        </View>
                        <Text
                          style={[styles.cell, { flex: 1, textAlign: "right" }]}
                        >
                          {item.amount}.00
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#fff",
    marginHorizontal: moderateScale(10),
    marginVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    padding: moderateScale(8),
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
  filterContainer: {
    position: "absolute",
    top: moderateScale(30),
    right: 0,
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    zIndex: 10,
    width: moderateScale(200),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  filterItem: {
    fontSize: moderateScale(12),
    marginBottom: moderateScale(5),
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default NewHistory;
