import React, {useEffect, useState, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getFunnelData, selectFunnel} from "shared/store/slices/funnelSlice";
import {AppDispatch} from "shared/store";
import {Order} from "shared/types/orders";
import styles from "./Funnel.module.scss";
import searchIcon from "shared/images/sideBarImgs/search.svg";
import chatIcons from "shared/images/chats.svg";
import chatIcon from "shared/images/chat.svg";
import SideFunnel from "widgets/SideBar/SideFunnel/SideFunnel";
import {getInitials} from "shared/helpers/userUtils";
import {formatCurrency} from "shared/helpers/formatCurrency";
import {useDragScroll} from "shared/hooks/useDragScroll";
import {useAppSelector} from "shared/hooks/useAppSelector";
import {getOrderById} from "shared/store/slices/orderSlice";

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

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "Дата не указана";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
        ? "Неверная дата"
        : date.toLocaleDateString("ru-RU");
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
                                        <div
                                            className={styles.taskCard}
                                            key={order.id}
                                            onClick={() => {
                                                setSelectedOrderId(order.id);
                                                setIsSidebarOpen(true);
                                                dispatch(getOrderById(order.id));
                                            }}
                                        >
                                            <div className={styles.taskContent}>
                                                <div className={styles.taskHeader}>
                                                    <div>
                                                        <h3 className={styles.taskTitle}>
                                                            {order.project_name ||
                                                                order.order_name ||
                                                                `Заявка №${order.id}`}
                                                        </h3>

                                                        <p className={styles.description}>
                                                            Клиент{" "}
                                                            {order.client?.custom_user?.full_name ||
                                                                `ID ${order.client?.id}`}
                                                        </p>
                                                    </div>
                                                    <div className={styles.taskActions}>
                                                        <button className={styles.taskActionButton}>
                                                            <img src={chatIcon} alt="чат"/>
                                                        </button>
                                                        <button className={styles.taskActionButton}>
                                                            <img src={chatIcons} alt="чаты"/>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className={styles.amount}>
                                                    {formatCurrency(order.approved_budget, order.estimated_budget)}
                                                </p>

                                                <div className={styles.taskDetails}>
                                                    <div className={styles.taskDetailItem}>
                            <span className={styles.taskDetailLabel}>
                              Начало статуса:
                            </span>
                                                        <span className={styles.taskDetailValue}>
                              {formatDate(order.created_at)}
                            </span>
                                                    </div>
                                                    <div className={styles.taskDetailItem}>
                            <span className={styles.taskDetailLabel}>
                              Посл. контакт:
                            </span>
                                                        <span className={styles.taskDetailValue}>
                              <u>{formatDate(order.updated_at)}</u>
                            </span>
                                                    </div>
                                                    <div className={styles.taskDetailItem}>
                            <span className={styles.taskDetailLabel}>
                              Трекер:
                            </span>
                                                        <span className={styles.taskDetailValue}>
                              <span className={styles.avatarCircle}>
                                {order.tracker_data &&
                                order.tracker_data.custom_user?.full_name
                                    ? getInitials(
                                        order.tracker_data.custom_user.full_name
                                    )
                                    : "–"}
                              </span>
                            </span>
                                                    </div>
                                                    <div className={styles.taskDetailItem}>
                            <span className={styles.taskDetailLabel}>
                              Специалисты:
                            </span>
                                                        <span className={styles.taskDetailValue}>
                              {(order.approved_specialists || [])
                                  .slice(0, 2)
                                  .map((spec) => (
                                      <span
                                          key={spec.id}
                                          className={styles.avatarCircle}
                                      >
                                    {spec.custom_user?.full_name
                                        ? getInitials(spec.custom_user.full_name)
                                        : `ID ${spec.id}`}
                                  </span>
                                  ))}

                                                            {order.approved_specialists &&
                                                                order.approved_specialists.length > 2 && (
                                                                    <span className={styles.avatarMore}>...</span>
                                                                )}
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
