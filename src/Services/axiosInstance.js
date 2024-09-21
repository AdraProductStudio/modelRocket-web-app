import axios from "axios";
import toast from "react-hot-toast";

let token = null;

const axiosInstance = axios.create({
  // baseURL: "https://consumerapi.matsuritech.com",
  baseURL: process.env.REACT_APP_API_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = async () => {
  try {
    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;

    const basicAuth = "Basic " + btoa(`${username}:${password}`);

    const response = await axios.get(
      `${process.env.REACT_APP_API_URI}/gettoken`,
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
