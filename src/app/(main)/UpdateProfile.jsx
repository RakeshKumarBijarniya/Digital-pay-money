import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { moderateScale } from "react-native-size-matters";
import { updateProfile } from "../services/LoginServices";
import { baseUrl } from "@/src/app/services/ApiServices";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");

const UpdateProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [takeImage, SetTakeImage] = useState(null);
  const [pic, setPic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successModal, setSuccssModal] = useState(false);

  const storage = Platform.OS === "web" ? global.localStorage : AsyncStorage;
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let data = await storage.getItem("myData");
        data = JSON.parse(data);

        if (data) {
          setUsername(data.name || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phone || "");
          setAddress(data.address || "");
          setProfileImage(data.image || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, [refresh]);

  // Pick Image from Gallery
  const pickImage = async () => {
    setPic(true);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your gallery."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0];

      SetTakeImage(selectedUri.uri);
      setProfileImage(selectedUri);

      let storedData = await AsyncStorage.getItem("myData");
      storedData = storedData ? JSON.parse(storedData) : {};
      storedData.profileImage = selectedUri;
      await AsyncStorage.setItem("myData", JSON.stringify(storedData));
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    if (!username || !address) {
      Alert.alert("Error", "Please fill in all required fields!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);
    formData.append("phone", phoneNumber);
    formData.append("address", address);

    if (takeImage) {
      formData.append("image", profileImage.file);
    }

    try {
      const response = await updateProfile(formData);

      setSuccessMessage("Profile updated successfully!");

      await storage.setItem(
        "myData",
        JSON.stringify({
          name: username,
          email,
          phone: phoneNumber,
          address,
          image: profileImage.file,
        })
      );
      setPic(false);
      setLoading(false);

      setSuccssModal(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
      setPic(false);
      setLoading(false);
      setRefresh((prev) => !prev);
      setSuccssModal(true);
    }
  };

  const navigateToLogin = async () => {
    await storage.removeItem("myData");
    router.push("/(auth)");
    setSuccssModal(false);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <ScrollView>
            <View style={styles.imageContainer}>
              {pic ? (
                <Image
                  source={{ uri: takeImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Image
                  source={{ uri: `${baseUrl}/uploads/${profileImage}` }}
                  style={styles.profileImage}
                />
              )}
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Text style={styles.uploadText}>Upload Image</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.midContainer}>
              <InputField
                label="Username"
                value={username}
                setValue={setUsername}
              />
              <InputField label="Email" value={email} editable={false} />
              <InputField
                label="Phone Number"
                value={phoneNumber}
                editable={false}
              />
              <InputField
                label="Address"
                value={address}
                setValue={setAddress}
                multiline
              />

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleProfileUpdate}
              >
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={successModal}
                onRequestClose={() => setSuccssModal(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{successMessage}</Text>
                    <TouchableOpacity onPress={navigateToLogin}>
                      <Text style={styles.successbutton}>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const InputField = ({
  label,
  value,
  setValue,
  editable = true,
  multiline = false,
}) => (
  <View>
    <Text>{label}</Text>
    <TextInput
      style={styles.inputField}
      value={value}
      onChangeText={setValue}
      editable={editable}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
    />
  </View>
);

// Styles
const styles = StyleSheet.create({
  mainContainer: { backgroundColor: "#4B83C3", height: "100%" },
  innerContainer: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(10),
  },
  imageContainer: { alignItems: "center" },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: "#171F1D",
    padding: 10,
    borderRadius: 10,
    marginBottom: moderateScale(10),
  },
  uploadText: { color: "#FFF" },
  midContainer: { backgroundColor: "#F6F4F0", padding: 10, borderRadius: 10 },
  inputField: { borderWidth: 1, padding: moderateScale(5), borderRadius: 10 },
  updateButton: {
    backgroundColor: "#171F1D",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: moderateScale(10),
  },
  updateButtonText: { color: "#FFF" },
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
  successbutton: {
    backgroundColor: "#04d43c",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default UpdateProfile;
