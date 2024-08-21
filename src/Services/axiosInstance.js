import axios from "axios";
import toast from "react-hot-toast";


let token = null;

const axiosInstance = axios.create({
  // baseURL: "https://consumerapi.matsuritech.com",
  baseURL: "http://10.10.24.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = async () => {
  try {
    const username = "matsuri";
    const password =
      "fc153ac36455604c6a6bcb3e22c0a4debfb746d59ad4a33a4b0d50f315206958d78da64e88957993e537e5ef235537a65ac0bc8fbaa725ae3e8e151617e82b81";

    const basicAuth = "Basic " + btoa(`${username}:${password}`);

    const response = await axios.get(
      "http://10.10.24.1:5000/gettoken",
      {
        headers: {
          Authorization: basicAuth,
        },
      }
    );

    if (response.data.error_code === 200) {
      localStorage.setItem("token", response.data.data.token);
    }
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.error_code === 0) {
      // toast.success(response.data.message);
    } else {
      // toast.error(response.data.message);
    }
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.msg === "Token has expired"
    ) {
      toast.error("Session expired, please try again...!");
      getToken();
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
