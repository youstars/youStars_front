import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import SpecialistCard from "./sections/SpecialistCard";

const SpecialistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const specialists = useSelector((state: RootState) => state.specialists.list);
  const specialist = specialists.find((s) => s.id === Number(id));

  if (!specialist) {
    return <div style={{ color: "white", padding: "20px" }}>Специалист не найден</div>;
  }

  return <SpecialistCard />;
};

export default SpecialistProfile;
