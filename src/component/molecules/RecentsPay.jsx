import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { getTransHistory } from "@/src/app/services/LoginServices";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const colors = ["#bf8282", "#8aa367", "#51948b", "#9675bd"];

const RecentsPay = () => {
  const [recentPayee, setRecentPayee] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistoryData = async (userId) => {
    try {
      if (!userId) {
        console.log("Invalid ID:", userId);
        return;
      }
      const response = await getTransHistory(userId);

      if (response?.data) {
        setRecentPayee(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getStoredData = async () => {
    setLoading(true);
    try {
      let data;
      if (Platform.OS === "web") {
        data = global.localStorage.getItem("myData");
      } else {
        data = await AsyncStorage.getItem("myData");
      }

      if (data) {
        const parsedData = JSON.parse(data);
        if (parsedData?.id) {
          fetchHistoryData(parsedData.id);
        } else {
          console.log("Invalid ID:", parsedData);
        }
      } else {
        console.log("No stored data found");
      }
    } catch (error) {
      console.error("Error retrieving stored data:", error);
    }
  };

  useEffect(() => {
    getStoredData();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Recent Payees</Text>

      {loading ? (
        <ActivityIndicator color="blue" size="large" />
      ) : (
        <FlatList
          data={recentPayee.slice(0, 10)}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          renderItem={(
            { item, index } // ✅ Destructure index here
          ) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                router.push({
                  pathname: "/WalletToWallet",
                  params: { mobile: item.receiver_phone },
                })
              }
            >
              <View
                style={[
                  styles.circle,
                  { backgroundColor: colors[index % colors.length] }, // ✅ Now index is defined
                ]}
              >
                <Text style={styles.initials}>
                  {item.receiver_name
                    ? item.receiver_name[0].toUpperCase()
                    : "U"}
                </Text>
              </View>
              <Text style={styles.itemText}>
                {item.receiver_name
                  ? item.receiver_name.split(" ")[0].toUpperCase()
                  : "UNKNOWN"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F6F4F0",
    top: 20,
    padding: 10,
    borderRadius: 10,
    height: moderateScale(140),
  },
  title: {
    fontWeight: "600",
    fontSize: 17,
    fontFamily: "SansitaSwashedBold",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: moderateScale(10),
  },
  circle: {
    backgroundColor: "#79D7BE",
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
  },
  itemText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
  },
});

export default RecentsPay;
