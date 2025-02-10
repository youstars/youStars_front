import axios from "axios";
import Cookies from "js-cookie";


const axiosInstance = axios.create({
  // baseURL: "https://consult-fozz.onrender.com/",
  baseURL: "http://127.0.0.1:8000/",
  
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});




export default axiosInstance;
