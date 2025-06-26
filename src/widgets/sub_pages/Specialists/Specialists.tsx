import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./Specialists.module.scss";
import { getSpecialists } from "shared/store/slices/specialistsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import SpecialistCard from "widgets/SpecialistCard/SpecialistCard";
import SideBarFilter from "shared/UI/SideBarFilter/SideBarFilter";
import SearchInput from "shared/UI/SearchInput/SearchInput";
import FilterBtn from "shared/UI/FilterBtn/FilterBtn";
import { getFunnelData } from "shared/store/slices/funnelSlice";
import { Order } from "shared/types/orders";
import { selectMe } from "shared/store/slices/meSlice";
import Cookies from "js-cookie";

function Specialists() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.specialists
  );
  const allOrders = useSelector((state: RootState) => state.funnel.funnel);
  const me = useSelector(selectMe);
  const userId = Number(Cookies.get("user_role_id"));
  console.log("userId", userId);

const [isStatusOpen, setIsStatusOpen] = useState(false);
const statusRef = useRef(null);


  

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  dispatch(getSpecialists());
  dispatch(getFunnelData());
}, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const ordersBySpecialist = useMemo(() => {
  const result: { [key: number]: Order[] } = {};

  if (!userId) return result;

  
  const filteredOrders = allOrders.filter(
    (order) => order.tracker_data?.id
    
  );

  console.log("filteredOrders", filteredOrders);
  

  list.forEach((specialist) => {
    result[specialist.id] = filteredOrders;
  });

  return result;
}, [list, allOrders, userId]);

  console.log(ordersBySpecialist);
  

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.shifted : ""}`}>
        <div className={styles.form}>
          <div className={styles.search}>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск специалиста"
            />
          </div>
          <FilterBtn onClick={() => setIsSidebarOpen(prev => !prev)} />
        </div>

        <h2 className={styles.resultsTitle}>
          Найдено {list.length} специалистов:
        </h2>

        <div className={styles.specialistList}>
          {list
            .filter(specialist =>
              specialist.custom_user?.full_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map(specialist => (
              <SpecialistCard
                key={specialist.id}
                specialist={specialist}
                orders={ordersBySpecialist[specialist.id] || []}
              />
            ))}
        </div>
      </div>

      <SideBarFilter isOpen={isSidebarOpen} />
    </div>
  );
}

export default Specialists;