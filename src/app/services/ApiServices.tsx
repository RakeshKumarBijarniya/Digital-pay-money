import axios from "axios";

export const baseUrl = "https://43d5-110-235-219-87.ngrok-free.app/api/v1";
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
    console.log("Request Interceptor:", config);
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

baseRouter.interceptors.response.use(
  (response) => {
    // Handle successful responses
    console.log("Response Interceptor:", response);
    return response;
  },
  (error) => {
    // Handle response errors globally
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default baseRouter;
