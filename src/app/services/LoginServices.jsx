import baseRouter from "./ApiServices";

const loginServiceApi = async (formData) => {
  console.log("formData", formData);
  const response = await baseRouter.post("/userLogin", formData);

  return response;
};

export { loginServiceApi };
