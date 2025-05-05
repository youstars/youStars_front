import { useSelector } from "react-redux";
import { selectMe } from "shared/store/slices/meSlice";

export const useUserRole = () => {
  const { data: me } = useSelector(selectMe);


  const role =
    me?.custom_user?.role || 
    me?.role ||             
    null;                    
  return role;
};
