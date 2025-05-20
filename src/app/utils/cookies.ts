import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

function getUserIdFromToken(): string | null {
  const token = Cookies.get("access_token"); 
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token); 
    return decoded.user_id || null; 
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return null;
  }
}


const userId = getUserIdFromToken();
if (userId) {
  Cookies.set("user_id", userId.toString(), { expires: 7, secure: true, sameSite: "None" });
  console.log("User ID сохранён в куки:", userId);
}

export { getUserIdFromToken };




 export const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    return value.split(`; ${name}=`)[1]?.split(';')[0];
  };
  


  export function setCookie(name: string, value: string, days?: number): void {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  }
  

  export function deleteCookie(name: string): void {
    setCookie(name, '', -1);
  }