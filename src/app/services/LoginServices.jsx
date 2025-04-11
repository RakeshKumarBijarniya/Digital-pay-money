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
const gasBillApi = async () => {
  const response = await baseRouter.post("/getOperaterbill");
  return response.data;
};
const licBillOperator = async () => {
  const response = await baseRouter.post("/getOperaterbill");
  return response.data;
};
const fetchLicBillDetails = async (data) => {
  const response = await baseRouter.post("/getLicbillDetails", data);
  return response.data;
};

const handleSubmitLicBill = async (data) => {
  const response = await baseRouter.post("/payLicBill", data);
  return response.data;
};

const lpgGasProvider = async () => {
  const response = await baseRouter.post("/getLpgOperaterbill");
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

const getLpgBillDetails = async (data) => {
  const response = await baseRouter.post("/getLpgBillDetails", data);
  return response.data;
};

const handleLpgBill = async (data) => {
  const response = await baseRouter.post("/payLPGBill", data);
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

const moblieOperator = async () => {
  const response = await baseRouter.post("/getOperater");
  return response.data;
};
const mobileRechargeSubmit = async (data) => {
  const response = await baseRouter.post("/mobile-rechargeSumbit", data);
  return response.data;
};

const transferWalletMoney = async (data) => {
  const response = await baseRouter.post("/transferWalletMoney", data);
  return response;
};

const updateProfile = async (formData) => {
  console.log(formData, "form Data Get ");
  try {
    const response = await baseRouter.put("/edit-view-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (e) {
    console.log(e.message);
  }
};

const sendOtp = async (formData) => {
  const response = await baseRouter.post("/sendOtp", formData);
  return response;
};

const verifyOtp = async (formData) => {
  const response = await baseRouter.post("/verifyOtp", formData);
  return response;
};
const userReg = async (formData) => {
  const response = await baseRouter.post("/userReg", formData);
  return response;
};
const changePassSendOtp = async (formData) => {
  const response = await baseRouter.post("/changePassSendOtp", formData);
  return response.data;
};
const resetPassword = async (formData) => {
  const response = await baseRouter.post("/resetPassword", formData);
  return response.data;
};
const forgotverifyOtp = async (formData) => {
  const response = await baseRouter.post("/forgotverifyOtp", formData);
  return response.data;
};

const getTransHistory = async (user_id) => {
  const response = await baseRouter.get(`/getTransHistory/${user_id}`);

  return response.data;
};
const getBillTransiton = async (user_id) => {
  const response = await baseRouter.get(`/bill-transition/${user_id}`);

  return response.data;
};

const getMobileTransaction = async (user_id) => {
  const response = await baseRouter.get(`/getMobileTrans/${user_id}`);

  return response.data;
};

const wallet_balance = async (user_id) => {
  const response = await baseRouter.get(`/getWalletBalance/${user_id}`);
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
  gasBillApi,
  lpgGasProvider,
  getLpgBillDetails,
  handleLpgBill,
  licBillOperator,
  fetchLicBillDetails,
  handleSubmitLicBill,
  moblieOperator,
  mobileRechargeSubmit,
  transferWalletMoney,
  updateProfile,
  sendOtp,
  verifyOtp,
  userReg,
  changePassSendOtp,
  resetPassword,
  forgotverifyOtp,
  getTransHistory,
  getBillTransiton,
  getMobileTransaction,
  wallet_balance,
};
