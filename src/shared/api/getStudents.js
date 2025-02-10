import axios from "axios";
import Cookies from "js-cookie";




const API_BASE_URL = "https://consult-fozz.onrender.com/";
export const getStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}ru/list/`, {
        headers: {
          "Accept": "application/json",
        },
      });
  
      console.log("📌 Данные специалистов:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка при получении специалистов:", error.response?.data || error);
      return null;
    }
  };
  
