import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (config.url?.includes("/drawings") && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;