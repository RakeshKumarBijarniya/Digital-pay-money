import AsyncStorage from "@react-native-async-storage/async-storage";
import baseRouter from "./ApiServices";

const loginServiceApi = async (formData) => {
  const response = await baseRouter.post("/userLogin", formData);

  return response;
};

const electricityApi = async () => {
  const response = await baseRouter.post("/getOperaterbill");
  return response.data;
};
const waterBillApi = async () => {
  const response = await baseRouter.post("/getOperaterbill");
  return response.data;
};

const getbillDetails = async (data) => {
  const response = await baseRouter.post("/getbillDetails", data);
  return response.data;
};

const handleSubmitBill = async (data) => {
  const response = await baseRouter.post("/payBill", data);
  return response.data;
};

const fetchDthApi = async () => {
  const response = await baseRouter.post("/getOperater");
  return response.data;
};
const getOperaterOrCricle = async (data) => {
  const response = await baseRouter.post("/getOperaterOrCricle", data);
  return response.data;
};
const getBrowserPlan = async (data) => {
  const response = await baseRouter.post("/getbrowerPlan", data);
  return response.data;
};
const dthrechargeSumbit = async (data) => {
  const response = await baseRouter.post("/dth-rechargeSumbit", data);
  return response.data;
};
export {
  loginServiceApi,
  electricityApi,
  getbillDetails,
  handleSubmitBill,
  fetchDthApi,
  getBrowserPlan,
  getOperaterOrCricle,
  dthrechargeSumbit,
  waterBillApi,
};
