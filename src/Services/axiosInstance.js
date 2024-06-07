import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://consumerapi.matsuritech.com",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const refreshToken = async () => {
  // Call your refresh token API here and return the new token
  // const newToken = await yourRefreshTokenFunction();
  // return newToken;
};

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.error_code === 0) {
      // Handle successful response
    } else {
      // Handle other responses
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        try {
          const newToken = await new Promise((resolve) => {
            refreshSubscribers.push((token) => {
              resolve(token);
            });
          });
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshToken()
          .then((newToken) => {
            axiosInstance.defaults.headers.common["Authorization"] =
              "Bearer " + newToken;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            refreshSubscribers.forEach((callback) => callback(newToken));
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
            refreshSubscribers = [];
          });
      });
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
