import { useState, useRef, useEffect } from "react";
import styles from "./Specialists.module.scss";
import { getSpecialists } from "shared/store/slices/specialistsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import SpecialistCard from "widgets/SpecialistCard/SpecialistCard";
import SideBarFilter from "shared/UI/SideBarFilter/SideBarFilter";
import SearchInput from "shared/UI/SearchInput/SearchInput";
import FilterBtn from "shared/UI/FilterBtn/FilterBtn";

function Specialists() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.specialists
  );


  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setIsSortMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
  };

  useEffect(() => {
    dispatch(getSpecialists());
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.mainContent} ${
          isSidebarOpen ? styles.shifted : ""
        }`}
      >
        <div className={styles.form}>
          <div className={styles.search}>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск специалиста"
            />
          </div>
          <FilterBtn onClick={() => setIsSidebarOpen((prev) => !prev)} />
        </div>

        <h2 className={styles.resultsTitle}>
          Найдено {list.length} специалистов:
        </h2>

        <div className={styles.specialistList}>
          {list
            .filter((specialist) =>
              specialist.custom_user?.full_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
        </div>
      </div>

      <SideBarFilter isOpen={isSidebarOpen} />
    </div>
  );
}

export default Specialists;
