import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      let data = await AsyncStorage.getItem("myData");
      data = JSON.parse(data);
      setUsername(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phone);
      setAddress(data.address);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View
        style={[
          styles.mainContainer,
          {
            paddingHorizontal: moderateScale(10),
            paddingVertical: moderateScale(10),
          },
        ]}
      >
        <ScrollView>
          <View>
            <Image
              source={require("@/src/assets/images/userLargeIcon.png")}
              resizeMode="contain"
              style={{ width: moderateScale(100), height: moderateScale(100) }}
            />
            <View
              style={{ flexDirection: "row", gap: 10, top: -35, left: 100 }}
            >
              <TouchableOpacity>
                <Image
                  source={require("@/src/assets/images/cameraIcon.png")}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ fontSize: moderateScale(14) }}>
                  Upload from gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            <View style={styles.midContainer}>
              <View>
                <Text>Username</Text>
                <TextInput
                  style={styles.inputField}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                />
              </View>
              <View>
                <Text>Email i'd</Text>
                <TextInput
                  style={styles.inputField}
                  value={email}
                  keyboardType="email-address"
                  editable={false}
                  onChangeText={(text) => setEmail(text)}
                  selectTextOnFocus={false}
                />
              </View>
              <View>
                <Text>Phone Number</Text>
                <TextInput
                  style={styles.inputField}
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text)}
                />
              </View>
              <View>
                <Text>Password</Text>
                <TextInput
                  style={styles.inputField}
                  value={password}
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                />
              </View>
              <View>
                <Text>Address</Text>
                <TextInput
                  style={styles.inputField}
                  value={address}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(text) => setAddress(text)}
                  textAlignVertical="top"
                />
              </View>
              <View>
                <TouchableOpacity style={styles.updateButton}>
                  <Text style={{ color: "#ffff", fontSize: 17 }}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#4B83C3",
    height: "100%",
  },
  midContainer: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    backgroundColor: "#F6F4F0",
    gap: 10,
    marginHorizontal: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  inputField: {
    borderRadius: 10,
    borderWidth: 1,
    width: "80%",
    padding: moderateScale(5),
  },
  updateButton: {
    backgroundColor: "#171F1D",
    textAlign: "center",
    borderRadius: 10,
    fontSize: 15,
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
    width: "80%",
  },
});

export default UpdateProfile;
