import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import { getSpecialistById } from "shared/store/slices/specialistSlice";
import { getMe, selectMe } from "shared/store/slices/meSlice";
import { useEffect } from "react";
import SpecialistCard from "./sections/SpecialistCardProfile";


interface SpecialistProfileProps {
  isSelf?: boolean;
}
const UserProfilePage = ({ isSelf = false }: SpecialistProfileProps) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data: me } = useSelector(selectMe);
  const { data: specialist, loading, error } = useSelector(
    (state: RootState) => state.specialist
  );

  useEffect(() => {
    if (id) {
      dispatch(getSpecialistById(Number(id)));
    } else {
      dispatch(getMe());
    }
  }, [dispatch, id]);

  if (loading) return <p style={{ color: "white" }}>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  const profileToRender = id ? specialist : me;

  if (!profileToRender || !profileToRender.custom_user)
    return <p>Профиль не найден</p>;

  const isCurrentUser =
    me?.custom_user?.id === profileToRender?.custom_user?.id;

  return (
    <SpecialistCard specialist={profileToRender} isSelf={isCurrentUser || isSelf} />
  );
};


export default UserProfilePage;
