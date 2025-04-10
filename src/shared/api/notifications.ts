import axios from "axios";

export const getNotifications = async () => {
  try {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];

    const response = await axios.get("http://127.0.0.1:8000/notification/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Ошибка при получении уведомлений:", error);
    return [];
  }
};