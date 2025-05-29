import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import { getSpecialistById, selectSpecialist } from "shared/store/slices/specialistSlice";
import { getMe, selectMe } from "shared/store/slices/meSlice";
import { useEffect } from "react";
import SpecialistCard from "./sections/SpecialistCardProfile";
import { ClientProfile } from "../ClientProfile/ClientProfile";

interface UserProfilePageProps {
  isSelf?: boolean;
}

const UserProfilePage = ({ isSelf = false }: UserProfilePageProps) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data: me } = useSelector(selectMe);
  const { data: specialist, loading, error } = useSelector(selectSpecialist);

  const meId = me?.id;
  const isClient = me?.role === "Client";
  const isViewingSelf = id && meId === Number(id);

  // Загружаем "себя"
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Загружаем специалиста, если это не текущий пользователь
  useEffect(() => {
    if (id && meId !== Number(id)) {
      dispatch(getSpecialistById(Number(id)));
    }
  }, [dispatch, id, meId]);

  if (loading) return <p style={{ color: "white" }}>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  // Заходим на себя по /specialists/:id
  if (id && isViewingSelf) {
    return isClient ? (
      <ClientProfile client={me} isSelf />
    ) : (
      <SpecialistCard specialist={me} isSelf />
    );
  }

  // Чужой специалист
  if (id && specialist?.id) {
    return <SpecialistCard specialist={specialist} isSelf={false} />;
  }

  // Путь без id или /me
  if (me?.id) {
    return isClient ? (
      <ClientProfile client={me} isSelf />
    ) : (
      <SpecialistCard specialist={me} isSelf />
    );
  }

  return <p style={{ color: "white" }}>Профиль не найден</p>;
};

export default UserProfilePage;
