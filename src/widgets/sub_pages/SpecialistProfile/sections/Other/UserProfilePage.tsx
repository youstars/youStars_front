import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import { getSpecialistById, selectSpecialist } from "shared/store/slices/specialistSlice";
import { selectMe } from "shared/store/slices/meSlice";
import { useEffect } from "react";
import SpecialistCard from "../../SpecialistCardProfile";
const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data: me } = useSelector(selectMe);
  const { data: specialist, loaded, error } = useSelector(selectSpecialist);

  const isSelf = me?.id === Number(id);

  useEffect(() => {
    if (id && !isSelf) {
      dispatch(getSpecialistById(Number(id)));
    }
  }, [dispatch, id, isSelf]);

console.log('🔄 useEffect triggered', { id, isSelf }) 

  if (error && !isSelf) {
    return <p style={{ color: "red" }}>Ошибка: {error}</p>;
  }


  if ((isSelf && me?.id) || specialist?.id) {
    return <SpecialistCard specialistId={Number(id)} isSelf={isSelf} />;
  }

  return <p style={{ color: "var(--primery-color)" }}>Специалист не найден</p>;
};

export default UserProfilePage;
