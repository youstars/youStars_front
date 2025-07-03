import {useState, useRef, useEffect, useMemo} from "react";
import styles from "./Specialists.module.scss";
import {getSpecialists} from "shared/store/slices/specialistsSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState, AppDispatch} from "shared/store";
import SpecialistCard from "widgets/SpecialistCard/SpecialistCard";
import SideBarFilter from "widgets/SideBar/SideBarFilter/SideBarFilter";
import SearchInput from "shared/UI/SearchInput/SearchInput";
import FilterBtn from "shared/UI/FilterBtn/FilterBtn";
import {getFunnelData} from "shared/store/slices/funnelSlice";
import {Order} from "shared/types/orders";
import {selectMe} from "shared/store/slices/meSlice";
import Cookies from "js-cookie";
import { useClickOutside } from "shared/hooks/useClickOutside";

function Specialists() {
  const dispatch = useDispatch<AppDispatch>();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useClickOutside(sidebarRef, () => setIsSidebarOpen(false));

  const { list, loading, error } = useSelector(
    (state: RootState) => state.specialists
  );
  const allOrders = useSelector((state: RootState) => state.funnel.funnel);
  const me = useSelector(selectMe);
  const userId = Number(Cookies.get("user_role_id"));

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [projectRange, setProjectRange] = useState({ min: 0, max: Infinity });
  const [taskRange, setTaskRange] = useState({ min: 0, max: Infinity });
  const [costRange, setCostRange] = useState({ min: 0, max: Infinity });

  useEffect(() => {
    dispatch(getSpecialists());
    dispatch(getFunnelData());
  }, [dispatch]);

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



  const countActiveOrders = (orders: Order[]) =>
    orders.filter((order) =>
      ["in_progress", "Нужно выполнить"].includes(String(order.status))
    ).length;

  const filteredSpecialists = useMemo(() => {
    return list
      .filter((specialist) =>
        specialist.custom_user?.full_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .filter((specialist) => {
        const projectCount = specialist.projects_in_progress_count ?? 0;
        return (
          projectCount >= projectRange.min && projectCount <= projectRange.max
        );
      })
      .filter((specialist) => {
        const taskCount = specialist.tasks_in_progress_count ?? 0;
        return taskCount >= taskRange.min && taskCount <= taskRange.max;
      })
      .filter((specialist) => {
        const cost = specialist.specialist_cost_total ?? 0;
        return cost >= costRange.min && cost <= costRange.max;
      });
  }, [list, searchTerm, projectRange, taskRange, costRange]);

    console.log(ordersBySpecialist);

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
         <div className={styles.filterOverlayWrapper} ref={sidebarRef}>
          <SideBarFilter
            isOpen={isSidebarOpen}
            selectedFilters={[]}
            onChangeFilters={() => {}}
            projectRange={projectRange}
            onChangeProjectRange={setProjectRange}
            taskRange={taskRange}
            onChangeTaskRange={setTaskRange}
            costRange={costRange}
            onChangeCostRange={setCostRange}
          />
        </div>

        <h2 className={styles.resultsTitle}>
          Найдено {filteredSpecialists.length} специалистов:
        </h2>

        <div className={styles.specialistList}>
          {filteredSpecialists.map((specialist) => (
            <SpecialistCard
              key={specialist.id}
              specialist={specialist}
              orders={ordersBySpecialist[specialist.id] || []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Specialists;
