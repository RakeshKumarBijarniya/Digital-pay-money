import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

let authToken = null;
const storage = Platform.OS === "web" ? global.localStorage : AsyncStorage;

let getAuthToken = async () => {
  if (Platform.OS === "web") {
    authToken = global.localStorage?.getItem("token");
  } else {
    authToken = await storage?.getItem("token");
  }
};

getAuthToken();

export const baseUrl = "https://dpm-project-k7na.onrender.com/api/v1";
// export const baseUrl = "9f98-110-235-219-120.grok-free.app/api/v1";
// Create an instance of axios with default configuration
const baseRouter = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can also set up interceptors here to handle requests and responses
baseRouter.interceptors.request.use(
  (config) => {
    // You can modify the request config here if necessary
    // E.g., add an authentication token from AsyncStorage or a global state
    if (authToken) {
      config.headers["x-access-token"] = authToken;
    }
    return config;
  },
  (error) => {
    // Handle request error

    return Promise.reject(error);
  }
);

baseRouter.interceptors.response.use(
  (response) => {
    // Handle successful responses

    return response;
  },
  (error) => {
    // Handle response errors globally
    //console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default baseRouter;
