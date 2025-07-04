import { useAppSelector } from "shared/hooks/useAppSelector";
import { selectMe } from "shared/store/slices/meSlice";
import SpecialistCard from "widgets/sub_pages/SpecialistProfile/SpecialistCardProfile";
import { ClientProfile } from "widgets/sub_pages/ClientProfile/ClientProfile";
import TrackerProfile from "widgets/TrackerProfile/TrackerProfile";
import Spinner from "shared/UI/Spinner/Spinner";

const ProfilePage = () => {
  const { data: user, loading, initialized } = useAppSelector(selectMe);

  if (loading || !initialized) {
    return <Spinner />;
  }

  if (!user) {
    return <p style={{ color: "red" }}>Пользователь не найден</p>;
  }

  const role = user.role?.toLowerCase();

  switch (role) {
    case "specialist":

return <SpecialistCard specialistId={user.id} isSelf={true} />



    case "client":
      return <ClientProfile client={user} isSelf={true} />;

    case "admin":
      return <TrackerProfile />;

    default:
      return <p style={{ color: "red" }}>Неизвестная роль</p>;
  }
};

export default ProfilePage;
