import React, {useEffect, useState, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getFunnelData, selectFunnel} from "shared/store/slices/funnelSlice";
import {AppDispatch} from "shared/store";
import {Order} from "shared/types/orders";
import styles from "./Funnel.module.scss";
import searchIcon from "shared/images/sideBarImgs/search.svg";
import SideFunnel from "widgets/SideBar/SideFunnel/SideFunnel";
import {useDragScroll} from "shared/hooks/useDragScroll";
import {useAppSelector} from "shared/hooks/useAppSelector";
import {getOrderById} from "shared/store/slices/orderSlice";
import TaskCard from "widgets/sub_pages/Funnel/components/TaskCard/TaskCard";

const statusLabels: Record<string, string> = {
    new: "Новая заявка",
    in_progress: "Обработка",
    matching: "Метчинг",
    prepayment: "Предоплата",
    working: "В работе",
    postpayment: "Постоплата",
    postprocessing: "Постобработка",
    done: "Завершен",
    canceled: "Отмена",
};

const Funnel = () => {
    const dispatch = useDispatch<AppDispatch>();
    const funnelData = useSelector(selectFunnel);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const dragScrollRef = useDragScroll();
    const order = useAppSelector((state) => state.order.current);

    const isOrderReady = isSidebarOpen && order?.id === selectedOrderId;

    useEffect(() => {
        dispatch(getFunnelData());
    }, [dispatch]);


    const filteredOrders = useMemo(() => {
        return funnelData.filter((order) =>
            (order.order_goal || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [funnelData, searchTerm]);

    console.log(filteredOrders);
    const groupedOrders = useMemo(() => {
        const groups: Record<string, Order[]> = {};
        Object.keys(statusLabels).forEach((status) => {
            groups[status] = [];
        });

        filteredOrders.forEach((order) => {
            if (groups.hasOwnProperty(order.status)) {
                groups[order.status].push(order);
            }
        });

        return groups;
    }, [filteredOrders]);


    const calculateTotalBudget = (orders: Order[]) => {
        return orders.reduce(
            (acc, cur) => acc + parseFloat(cur.estimated_budget || "0"),
            0
        );
    };


    return (
        <div
            className={styles.container}
            style={{marginRight: isSidebarOpen ? "16%" : "0"}}
        >
            <div className={styles.search}>
                <div className={styles.input_wrapper}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={searchIcon} alt="Поиск" className={styles.searchIcon}/>
                </div>
            </div>

            <div className={styles.statusColumns} ref={dragScrollRef}>
                {Object.entries(statusLabels).map(([statusKey, label]) => {
                    const items = groupedOrders[statusKey] || [];
                    const totalBudget = calculateTotalBudget(items);

                    return (
                        <div key={statusKey} className={styles.statusColumn}>
                            <div className={styles.statusHeader}>
                                <h3>
                                    ({items.length}) <b>{label}</b>
                                    &nbsp;&nbsp;&nbsp;
                                    <span className={styles.statusAmount}>
                    {totalBudget > 0
                        ? `${Math.round(totalBudget).toLocaleString("ru-RU")} ₽`
                        : "—"}
                  </span>
                                </h3>
                            </div>

                            <div className={styles.tasksList}>
                                {items.length > 0 ? (
                                    items.map((order) => (
                                        <TaskCard
                                            key={order.id}
                                            order={order}
                                            onSelect={(id) => {
                                                setSelectedOrderId(id);
                                                setIsSidebarOpen(true);
                                                dispatch(getOrderById(id));
                                            }}
                                        />
                                    ))
                                ) : (
                                    <p className={styles.noOrders}>Нет заявок</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>


            {isOrderReady && (
                <SideFunnel
                    isOpen={true}
                    toggleSidebar={() => setIsSidebarOpen(false)}
                    orderId={selectedOrderId!.toString()}
                />
            )}
        </div>
    );
};

export default React.memo(Funnel);
