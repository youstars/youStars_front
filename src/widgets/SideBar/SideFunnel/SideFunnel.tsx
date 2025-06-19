import React, {useEffect, useState, useCallback} from "react";
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import classes from "./SideFunnel.module.scss";
import {useAppDispatch} from "shared/hooks/useAppDispatch";
import {useNavigate} from "react-router-dom";
import {useOrder} from "shared/hooks/useOrder";
import Plus from "shared/assets/icons/plus.svg";
import {
    updateOrderTitle,
    assignTrackerToOrder,
    confirmPrepayment,
} from "shared/store/slices/orderSlice";
import {
    approveInvitation,
    rejectInvitation,
} from "shared/store/slices/invitationSlice";
import {updateOrderStatus} from "shared/store/slices/orderSlice";
import {formatDate} from "shared/helpers/userUtils";
import Approve from "shared/images/sideBarImgs/fi-br-checkbox.svg";
import Decline from "shared/images/sideBarImgs/Checkbox.svg";
import {useChatService} from "shared/hooks/useWebsocket";
import {findChatByParticipantId} from "shared/helpers/chatUtils";
import ChatsIcon from "shared/assets/icons/ChatsY.svg";
import ChatIcon from "shared/assets/icons/chatY.svg";
import InvitationStatus from "widgets/SideBar/SideFunnel/InvitationStatus/InvitationStatus";
import {useSelector} from "react-redux";
import {selectMe} from "shared/store/slices/meSlice";
import Cookies from "js-cookie";

import SideFunnelHeader from "./parts/SideFunnelHeader";
import OrderInfo from "./parts/OrderInfo";
import InvitedSpecialistsList from "./parts/InvitedSpecialistsList";
import ApprovedSpecialistsList from "./parts/ApprovedSpecialistsList";
import OrderFiles from "./parts/OrderFiles";
import Subtasks from "./parts/Subtasks";


/** Strict enum for order statuses to avoid magic strings */
export enum OrderStatus {
    InProgress = "in_progress",
    Matching = "matching",
    Prepayment = "prepayment",
}

interface DeadlineBlockProps {
    label: string;
    icon: React.ReactNode;
    value: string | null | undefined;
}

const DeadlineBlock: React.FC<DeadlineBlockProps> = ({label, icon, value}) => (
    <div className={classes.project_name}>
        <p>{label}</p>
        <div className={classes.fidback}>
            {icon}
            <p>{value ?? "—"}</p>
        </div>
    </div>
);

interface SideFunnelProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    orderId: string;
}

const SideFunnel: React.FC<SideFunnelProps> = ({
                                                   isOpen,
                                                   toggleSidebar,
                                                   orderId,
                                               }) => {
    const {chats, setActiveChat} = useChatService();
    const {order, refresh} = useOrder(orderId);

    const me = useSelector(selectMe);
    const userId = Number(Cookies.get("user_role_id"));

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notify = useNotify();

    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [editableTitle, setEditableTitle] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    // const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budgetValue, setBudgetValue] = useState("");


    useEffect(() => {
        if (order) {
            setEditableTitle(order.project_name || order.order_name || "");
            setBudgetValue(
                order?.approved_budget?.toString() ||
                order?.estimated_budget?.toString() ||
                ""
            );
        }
    }, [order]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                toggleSidebar();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, toggleSidebar]);

    const handleClientChat = () => {
        const clientUserId = order?.client?.custom_user?.id;
        const chat = findChatByParticipantId(chats, clientUserId);
        if (chat) {
            setActiveChat(chat.id);
            navigate("/manager/chats");
        } else {
            notify.error("Чат с этим клиентом не найден.");
        }
    };

    const handleTitleSave = async () => {
        if (!editableTitle.trim() || editableTitle === order?.project_name) return;
        try {
            await dispatch(
                updateOrderTitle({
                    orderId: order!.id.toString(),
                    projectName: editableTitle,
                    currentStatus: order!.status as OrderStatus,
                })
            );
            await refresh();
        } catch (error) {
            notify.error("Не удалось сохранить название заявки.");
        } finally {
            setIsEditingTitle(false);
        }
    };

    const handleBecomeTracker = async () => {
        try {
            if (!orderId || !userId) return;
            await dispatch(assignTrackerToOrder({orderId, trackerId: userId}));
            await refresh();
            toggleSidebar();
        } catch {
            notify.error("Не удалось назначить вас трекером.");
        }
    };

    if (!order) {
        return <div>Loading order...</div>;
    }

    const clientUser = order.client?.custom_user;
    const clientName =
        clientUser?.full_name || (order.client ? `ID ${order.client.id}` : "—");
    // const clientInitials = getInitials(clientName);
    const invitedSpecialists = order.invited_specialists || [];
    const approvedSpecialists = order.approved_specialists || [];
    return (
        <div
            className={`${classes.sidebarContainer} ${
                isOpen ? classes.containerOpen : ""
            }`}
        >
            <div
                ref={sidebarRef}
                className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}
            >
                <button className={classes.toggleButton} onClick={toggleSidebar}>
                    {isOpen ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
                </button>

                <div className={classes.contentWrapper}>
                    <div className={classes.content}>
                        {/* HEADER */}
                        <SideFunnelHeader
                            client={order.client}
                            onClientChat={handleClientChat}
                        />

                        {/* TITLE */}
                        <div className={classes.title}>
                            {[OrderStatus.InProgress, OrderStatus.Matching].includes(order.status as OrderStatus) &&
                            isEditingTitle ? (
                                <input
                                    value={editableTitle}
                                    onChange={(e) => setEditableTitle(e.target.value)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleTitleSave();
                                        }
                                    }}
                                    autoFocus
                                    className={classes.titleInput}
                                />
                            ) : (
                                <span
                                    onClick={() => {
                                        if (
                                            [OrderStatus.InProgress, OrderStatus.Matching].includes(order.status as OrderStatus)
                                        )
                                            setIsEditingTitle(true);
                                    }}
                                >
                  {editableTitle || `Заявка № ${order?.id}` || "Без названия"}
                </span>
                            )}
                        </div>

                        {/* DEADLINES */}
                        <div className={classes.time_block}>
                            <DeadlineBlock
                                label="Дедлайн статуса"
                                icon={<Calendar size={14} className={classes.icon}/>}
                                value={formatDate(order.project_deadline)}
                            />
                            <DeadlineBlock
                                label="Начало статуса"
                                icon={<Calendar size={14} className={classes.icon}/>}
                                value="12.02.2025"
                            />
                            <DeadlineBlock
                                label="Последний контакт с заказчиком"
                                icon={<Calendar size={14} className={classes.icon}/>}
                                value={formatDate(order.updated_at)}
                            />
                            <DeadlineBlock
                                label="Создано"
                                icon={<Clock size={14} className={classes.icon}/>}
                                value={formatDate(order.created_at)}
                            />
                        </div>

                        {/* INFO */}
                        <div className={classes.title}>
                            Информация по заявке
                            <span
                                className={`${classes.arrow} ${isInfoOpen ? classes.up : ""}`}
                                onClick={() => setIsInfoOpen((prev) => !prev)}
                            />
                        </div>
                        {isInfoOpen && (
                            <OrderInfo
                                status={order.status as OrderStatus}
                                initialBudget={budgetValue}
                                trackerName={order.tracker_data?.custom_user?.full_name || null}
                                onBudgetChange={setBudgetValue}
                            />
                        )}

                        {/* NOTE */}
                        <div className={classes.blok_paragraph}>
                            <h3>Заметка по заявке</h3>
                            <div className={classes.paragraph}>
                                <p>{order.extra_wishes || "Комментариев нет"}</p>
                            </div>
                        </div>

                        {order.status === OrderStatus.Matching && (
                            <>
                                <div className={classes.invitedHeader}>
                                    <h4>Приглашённые специалисты</h4>
                                    <div className={classes.actions}><span>принять</span><span>оплата</span></div>
                                </div>

                                <div className={classes.plusWrapper}>
                                    {/* кнопка «добавить» оставляем без изменений */}
                                </div>

                                <InvitedSpecialistsList
                                    items={invitedSpecialists}
                                    onApprove={async (id) => {
                                        await dispatch(approveInvitation(id));
                                        await refresh();
                                    }}
                                    onReject={(id) => dispatch(rejectInvitation(id)).then(refresh)}
                                />

                                <div className={classes.title}>Утверждённые специалисты</div>

                                <ApprovedSpecialistsList items={approvedSpecialists}/>
                            </>
                        )}

                        {/* SUBTASKS */}
                        <Subtasks
                          onAddSubtask={(text) => {
                            // TODO: dispatch addSubtask when API is ready
                            console.log("new subtask:", text);
                          }}
                        />

                        <OrderFiles
                          termsOfReference={order.file_terms_of_reference}
                          commercialOffer={order.file_commercial_offer}
                          other={order.file_other_file}
                        />

                        {/* BUTTON */}
                        <button
                            className={classes.submitButton}
                            onClick={async () => {
                                if (order.status === OrderStatus.InProgress) {
                                    await handleTitleSave();
                                    await refresh();
                                } else if (order.status === OrderStatus.Matching) {
                                    const parsedBudget = parseFloat(budgetValue);
                                    if (
                                        !budgetValue.trim() ||
                                        isNaN(Number(budgetValue)) ||
                                        Number(budgetValue) <= 0
                                    ) {
                                        notify.error("Укажите корректный утверждённый бюджет (больше 0), прежде чем переходить к следующему этапу.");
                                        return;
                                    }

                                    await dispatch(
                                        updateOrderStatus({
                                            orderId,
                                            newStatus: OrderStatus.Prepayment,
                                            approved_budget: parsedBudget,
                                        })
                                    );
                                    await refresh();
                                } else if (order.status === OrderStatus.Prepayment) {
                                    await dispatch(confirmPrepayment({orderId}));
                                    await refresh();
                                } else {
                                    await handleBecomeTracker();
                                    await refresh();
                                }
                            }}
                            disabled={
                                (order.status === OrderStatus.Matching &&
                                    (!order.approved_specialists ||
                                        order.approved_specialists.length === 0)) ||
                                (order.status === OrderStatus.InProgress &&
                                    order.order_name === `Заявка № ${order.id}`)
                            }
                        >
                            {order.status === OrderStatus.InProgress
                                ? "Мэтчинг"
                                : order.status === OrderStatus.Matching
                                    ? "Утвердить специалистов"
                                    : order.status === OrderStatus.Prepayment
                                        ? "Предоплата получена"
                                        : "Стать трекером"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideFunnel;

/**
 * Temporary local fallback until the shared useNotify hook is available.
 * Provides error / success / info methods that just log to console.
 */
const useNotify = () => {
    const log = (level: "error" | "success" | "info") => (msg: string) => {
        // eslint-disable-next-line no-console
        console[level === "error" ? "error" : "log"](`[${level}] ${msg}`);
    };
    return {
        error: log("error"),
        success: log("success"),
        info: log("info"),
    };
};