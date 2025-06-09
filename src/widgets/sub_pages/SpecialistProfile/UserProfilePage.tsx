import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import { getSpecialistById, selectSpecialist } from "shared/store/slices/specialistSlice";
import { useEffect } from "react";
import SpecialistCard from "./sections/SpecialistCardProfile";

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data: specialist, loadingGetById, error } = useSelector(selectSpecialist);

  useEffect(() => {
    if (id) {
      dispatch(getSpecialistById(Number(id)));
    }
  }, [dispatch, id]);

  if (loadingGetById) {
    return <p style={{ color: "var( --primery-color)" }}>Загрузка специалиста...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Ошибка: {error}</p>;
  }

  if (specialist?.id) {
    return <SpecialistCard specialist={specialist} isSelf={false} />;
  }

  return <p style={{ color: "var( --primery-color)" }}>Специалист не найден</p>;
};

export default UserProfilePage;
