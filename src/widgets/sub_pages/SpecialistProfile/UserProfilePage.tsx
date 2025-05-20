import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import { getSpecialistById } from "shared/store/slices/specialistSlice";
import { getClientMe, getClientById } from "shared/store/slices/clientSlice";
import { getMe, selectMe } from "shared/store/slices/meSlice";
import { useEffect, useState } from "react";
import SpecialistCard from "./sections/SpecialistCard";
import { ClientProfile } from "../ClientProfile/ClientProfile";
import { useUserRole } from "shared/hooks/useUserRole";

const UserProfilePage = ({ isSelf = false }: { isSelf?: boolean }) => {
  const { id } = useParams<{ id: string}>();
  const dispatch = useDispatch<AppDispatch>();

  const { data: me } = useSelector(selectMe);
  const {
    data: specialist,
    loading: specialistLoading,
    error: specialistError,
  } = useSelector((state: RootState) => state.specialist);
  const {
    data: client,
    loading: clientLoading,
    error: clientError,
  } = useSelector((state: RootState) => state.client);

  const [localUser, setLocalUser] = useState<any>(null);
  const role = useUserRole();

  useEffect(() => {
    const load = async () => {
      if (isSelf) {
        const action = await dispatch(getMe());
        if (getMe.fulfilled.match(action)) {
          setLocalUser(action.payload);
          dispatch(getClientMe());
        }
      } else if (id && !isNaN(Number(id))) {
        const numericId = Number(id);
        dispatch(getSpecialistById(numericId));
        dispatch(getClientById(numericId));
      }
    };

    load();
  }, [dispatch, id, isSelf]);

  if (specialistLoading || clientLoading) {
    return <p style={{ color: "white" }}>Загрузка...</p>;
  }

  if (specialistError || clientError) {
    return <p style={{ color: "red" }}>Ошибка: {specialistError || clientError}</p>;
  }

  const user = isSelf ? localUser : me;

  if (!user && !specialist && !client) {
    return <p style={{ color: "white" }}>Пользователь не найден</p>;
  }

  if (role === "Specialist") {
    return (
        specialist && (
            <SpecialistCard specialist={isSelf ? localUser : specialist} isSelf={isSelf} />
        )
    );
  }

  if (role === "Client") {
    return <ClientProfile />;
  }

  return <p style={{ color: "white" }}>Неизвестная роль пользователя</p>;
};

export default UserProfilePage;
