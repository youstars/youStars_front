import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id?: string;
  [key: string]: any;
}

export const setToken = (token: string): void => {
  Cookies.set("access_token", token, {
    expires: 7,
    secure: true,
    sameSite: "Lax",
    path: "/",
  });
};

export const getToken = (): string | undefined => {
  return Cookies.get("access_token");
};


export const deleteToken = (): void => {
  Cookies.remove("access_token", { path: "/" });
};

export const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.user_id ?? null;
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return null;
  }
};

export const saveUserIdFromToken = (): void => {
  const userId = getUserIdFromToken();
  if (userId) {
    Cookies.set("user_id", userId, {
      expires: 7,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });
    console.log("User ID сохранён в куки:", userId);
  }
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string, days = 7): void => {
  Cookies.set(name, value, {
    expires: days,
    secure: true,
    sameSite: "Lax",
    path: "/",
  });
};

export const deleteCookie = (name: string): void => {
  Cookies.remove(name, { path: "/" });
};
