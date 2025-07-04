import axios from "axios";
import Cookies from "js-cookie";
import type { AxiosRequestHeaders } from "axios";


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");

  const headers: AxiosRequestHeaders = (config.headers ||
    {}) as AxiosRequestHeaders;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  config.headers = headers;
  return config;
});




export default axiosInstance;
