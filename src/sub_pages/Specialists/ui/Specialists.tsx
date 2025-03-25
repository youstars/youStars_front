import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Filter, Check } from "lucide-react";
import styles from "./Specialists.module.scss";
import { getSpecialists } from "shared/store/slices/specialistsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import { useNavigate } from "react-router-dom";
import Search from "shared/UI/Search/Search";
import SpecialistCard from "widgets/SpecialistCard/SpecialistCard";
// import { useWebSocket } from 'context/WebSocketContext'

function Specialists() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.specialists
  );
  const navigate = useNavigate();
  // const [creatingChat, setCreatingChat] = useState<number | null>(null);
  // const webSocket = useWebSocket();



  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("rating");
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  const sortOptions = [
    { id: "rating", label: "По рейтингу" },
    { id: "reviews", label: "По отзывам" },
    { id: "date", label: "По дате регистрации" },
    { id: "projects", label: "По количеству проектов" },
  ];

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

  const handleSortSelect = (sortId: string) => {
    setSelectedSort(sortId);
    setIsSortMenuOpen(false);
  };

  useEffect(() => {
    dispatch(getSpecialists());
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Search and Filter Header */}
        <div className={styles.searchHeader}>
          <Search />
          <div className={styles.buttonGroup}>
            <button
              ref={sortButtonRef}
              className={`${styles.sortButton} ${
                isSortMenuOpen ? styles.active : ""
              }`}
              onClick={toggleSortMenu}
            >
              <SlidersHorizontal size={20} />
              Сортировка
            </button>
            {isSortMenuOpen && (
              <div className={styles.sortMenu}>
                {sortOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`${styles.sortOption} ${
                      selectedSort === option.id ? styles.active : ""
                    }`}
                    onClick={() => handleSortSelect(option.id)}
                  >
                    <span className={styles.checkmark}>
                      <Check size={16} />
                    </span>
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <h2 className={styles.resultsTitle}>
          Найдено {list.length} специалистов:
        </h2>

        {/* Specialists List */}
        <div className={styles.specialistList}>
          {list.map((specialist) => (
            <SpecialistCard key={specialist.id} specialist={specialist} />
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      <div className={styles.filterPanel}>
        <div className={styles.filterTitle}>
          <Filter className={styles.filterIcon} />
          Фильтр
        </div>

        {/* Profession Section */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Профессия</h3>
          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="design" defaultChecked />
              <label htmlFor="design">Дизайн</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="graphicDesign" />
              <label htmlFor="graphicDesign">Графический дизайн</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="uxui" />
              <label htmlFor="uxui">UX / UI</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="animation" />
              <label htmlFor="animation">2D / 3D Анимация</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="other" />
              <label htmlFor="other">Другое</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="programming" />
              <label htmlFor="programming">Программирование</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="hr" />
              <label htmlFor="hr">HR</label>
            </div>
          </div>
        </div>

        {/* Salary Range Section */}
        <div className={styles.salaryRange}>
          <h3 className={styles.sectionTitle}>Ожидание по зарплате</h3>
          <div className={styles.rangeInputs}>
            <input type="text" className={styles.rangeInput} placeholder="От" />
            <span className={styles.currencySymbol}>₽</span>
            <input type="text" className={styles.rangeInput} placeholder="До" />
            <span className={styles.currencySymbol}>₽</span>
          </div>
          <div className={styles.rangeSlider}>
            <div className={styles.sliderHandle}></div>
            <div className={styles.sliderHandle}></div>
          </div>
        </div>

        {/* Experience Section */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Образование и опыт</h3>
          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="noExperience" defaultChecked />
              <label htmlFor="noExperience">Без опыта</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="junior" defaultChecked />
              <label htmlFor="junior">Junior</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="senior" />
              <label htmlFor="senior">Senior</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="middle" defaultChecked />
              <label htmlFor="middle">Middle</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="top" />
              <label htmlFor="top">Top</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Specialists;
