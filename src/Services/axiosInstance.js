import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://consumerapi.matsuritech.com",
  // baseURL: "http://10.10.24.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});



export default axiosInstance;
