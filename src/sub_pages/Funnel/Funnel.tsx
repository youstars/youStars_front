import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, selectFunnel } from "shared/store/slices/funnelSlice";
import { AppDispatch } from "shared/store";
import styles from "./Funnel.module.scss";
import search from "shared/images/sideBarImgs/search.svg";
import settingsIcon from "shared/images/setingsIcon.svg";
import addIcon from "shared/images/addIcon.svg";
import correctIcon from "shared/images/corectIcon.svg";
import kubikIcon from "shared/images/kubikIcon.svg";
import saveIcon from "shared/images/saveIcon.svg";
import chatIcon from "shared/images/chatIcon.svg";
import SideFunnel from "../../widgets/SideBar/SideFunnel/SideFunnel";

interface Funnel {
    amount: string;
    creation_date: string;
    description: string;
    id: number;
    payment_status: boolean;
    student: number;
    status: number;
}

const statusTitles: { [key: number]: string } = {
    0: "Новая заявка",
    1: "Обработка",
    2: "Утверждение специалиста",
    3: "Оплачено",
};

const borderColors = ["#FF4E4E", "#FFC400", "#3AFAE5"];
const getRandomBorderColor = () => borderColors[Math.floor(Math.random() * borderColors.length)];
const formatDate = (dateString: string) => {
    if (!dateString) return "Не указана";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Не указана";
    return date.toLocaleDateString("ru-RU");
};

const OrderCard = React.memo(({ order }: { order: Funnel }) => (
    <div className={styles.taskCard}>
        <div
            className={styles.taskContent}
            style={{ borderLeft: `2px solid ${getRandomBorderColor()}` }}
        >
            <p className={styles.description}>{order.description || "Без описания"}</p>
            <p className={styles.amount}>
                {order.amount ? `${Math.round(parseFloat(order.amount))} ₽` : "Не указано"}
            </p>
            <p className={styles.date}>{formatDate(order.creation_date)}</p>
            <p className={styles.student}>Студент: {order.student || "Не назначен"}</p>
            <p className={styles.payment}>
                {order.payment_status ? "Оплачено" : "Не оплачено"}
            </p>
        </div>
        <div className={styles.content_icons}>
            <img src={kubikIcon} alt=""/>
            <img src={saveIcon} alt=""/>
            <img src={chatIcon} alt=""/>
        </div>
    </div>
));

const Funnel = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const funnelData = useSelector(selectFunnel);
    const [selected, setSelected] = useState<number>(0);
    const [selectedSubOption, setSelectedSubOption] = useState<number>(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const subHandleSelect = useCallback((index: number) => {
        setSelectedSubOption(index);
    }, []);

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    const filteredData = useMemo(() => {
        return funnelData?.filter((order: Funnel) =>
            order.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
    }, [funnelData, searchTerm]);

    const ordersByStatus = useMemo(() => {
        const groupedOrders: { [key: number]: Funnel[] } = { 0: [], 1: [], 2: [], 3: [] };
        let index = 0;
        filteredData.forEach((order) => {
            const status = index % 4;
            groupedOrders[status].push(order);
            index++;
        });
        return groupedOrders;
    }, [filteredData]);

    const handleSelect = useCallback((index: number) => {
        setSelected(index);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className={styles.container} style={{ marginRight: isSidebarOpen ? "16%" : "0" }}>
            <div className={styles.search}>
                <div className={styles.input_wrapper}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={search} alt=""/>
                </div>
                <div className={styles.icons}>
                    <img src={settingsIcon} alt="" style={{cursor: 'pointer'}}/>
                    <img src={addIcon} alt=""/>
                    {/* При клике на correctIcon открываем модалку */}
                    <img
                        src={correctIcon}
                        alt=""
                        style={{cursor: 'pointer'}}
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
            </div>

            <div className={styles.options}>
                <div className={styles.options_items}>
                    {["Все", "Новые", "По сроку", "По количеству задач", "По бюджету"].map((item, index) => (
                        <p
                            key={index}
                            className={selected === index ? styles.selected : ""}
                            onClick={() => handleSelect(index)}
                        >
                            {item}
                        </p>
                    ))}
                </div>
                <div>
                    <img src={settingsIcon} alt="Настройки"/>
                </div>
            </div>

            <div className={styles.sub_options}>
                <div className={styles.sub_options_items}>
                    {["Канбан", "Список", "Таймлайн", "Отчеты"].map((item, index) => (
                        <p
                            key={index}
                            className={`${styles.sub_option} ${selectedSubOption === index ? styles.selected_sub_option : ""}`}
                            onClick={() => subHandleSelect(index)}
                        >
                            {item}
                        </p>
                    ))}
                </div>
            </div>

            <div className={styles.statusColumns}>
                {Object.keys(statusTitles).map((statusKey) => {
                    const status = parseInt(statusKey);
                    const statusOrders = ordersByStatus[status];

                    return (
                        <div key={status} className={styles.statusColumn}>
                            <div className={styles.statusHeader}>
                                <h3>{statusTitles[status]}</h3>
                            </div>
                            <div className={styles.tasksList}>
                                {statusOrders.length > 0 ? (
                                    statusOrders.map((order) => (
                                        <OrderCard key={order.id} order={order}/>
                                    ))
                                ) : (
                                    <p className={styles.noOrders}>Нет заявок</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <SideFunnel isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Модальное окно */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
                            X
                        </button>
                        <h2>Модальное окно</h2>
                        <p>Здесь находится содержимое модального окна.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(Funnel);
