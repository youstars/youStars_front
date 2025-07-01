import React, {useEffect, useState, useCallback} from "react";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import classes from "./SideFunnel.module.scss";
import {useAppDispatch} from "shared/hooks/useAppDispatch";
import {useNavigate} from "react-router-dom";
import {useOrder} from "shared/hooks/useOrder";
import Plus from "shared/assets/icons/plus.svg";
import {
    updateOrderTitle,
    updateOrderDeadline,
    updateOrderGoal,
    updateOrderProductOrService,
    updateOrderProblems,
    updateOrderExtraWishes,
    assignTrackerToOrder,
    confirmPrepayment,
} from "shared/store/slices/orderSlice";
import {
    approveInvitation,
    rejectInvitation,
    updateInvitationPayment,
} from "shared/store/slices/invitationSlice";
import {updateOrderStatus} from "shared/store/slices/orderSlice";
import {useChatService} from "shared/hooks/useWebsocket";
import {findChatByParticipantId} from "shared/helpers/chatUtils";
import Cookies from "js-cookie";

import Header from "./parts/Header/Header";
import InfoSection from "./parts/InfoSection/InfoSection";
import InvitedSpecialistsList from "./parts/InvitedSpecialistsList/InvitedSpecialistsList";
import ApprovedSpecialistsList from "./parts/ApprovedSpecialists/ApprovedSpecialistsList";
import OrderFiles from "./parts/OrderFiles/OrderFiles";
import SubTasks from "widgets/SideBar/SideFunnel/parts/SubTasks/SubTasks";
import EditableField from "./components/EditableField/EditableField";
import DeadlinesSection from "../SideFunnel/parts/DeadlinesSection/DeadlinesSection";


export enum OrderStatus {
    NewOrder = "new",
    InProgress = "in_progress",
    Matching = "matching",
    Prepayment = "prepayment",
}

interface DeadlineBlockProps {
    label: string;
    icon: React.ReactNode;
    value: string | null | undefined;
}

const DeadlineBlock: React.FC<DeadlineBlockProps> = ({
                                                         label,
                                                         icon,
                                                         value,
                                                     }) => (
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

    const userId = Number(Cookies.get("user_role_id"));

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notify = useNotify();

    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const infoRef = React.useRef<HTMLDivElement>(null);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budgetValue, setBudgetValue] = useState("");

    useEffect(() => {
        if (!order) return;

        if (infoRef.current) {
            infoRef.current.style.maxHeight = isInfoOpen
                ? `${infoRef.current.scrollHeight}px`
                : "0";
        }
    }, [isInfoOpen, order]);

    const handleClientChat = useCallback(() => {
        const clientUserId = order?.client?.custom_user?.id;
        const chat = findChatByParticipantId(chats, clientUserId);
        if (chat) {
            setActiveChat(chat.id);
            navigate("/manager/chats");
        } else {
            notify.error("Чат с этим клиентом не найден.");
        }
    }, [chats, navigate, notify, setActiveChat]);

    const handleGoalEdit = useCallback(async (newText: string) => {
        try {
            await dispatch(updateOrderGoal({orderId, orderGoal: newText}));
            await refresh();
            notify.success("Запрос сохранён");
        } catch {
            notify.error("Не удалось сохранить запрос");
        }
    }, [dispatch, refresh, notify]);

    const handleProductEdit = useCallback(async (newText: string) => {
        try {
            await dispatch(updateOrderProductOrService({orderId, productOrService: newText}));
            await refresh();
            notify.success("Продукт сохранён");
        } catch {
            notify.error("Не удалось сохранить продукт или услугу");
        }
    }, [dispatch, refresh, notify]);

    const handleProblemsEdit = useCallback(async (newText: string) => {
        try {
            await dispatch(updateOrderProblems({orderId, solvingProblems: newText}));
            await refresh();
            notify.success("Проблемы сохранены");
        } catch {
            notify.error("Не удалось сохранить проблемы");
        }
    }, [dispatch, refresh, notify]);

    const handleExtraEdit = useCallback(async (newText: string) => {
        try {
            await dispatch(updateOrderExtraWishes({orderId, extraWishes: newText}));
            await refresh();
            notify.success("Пожелания сохранены");
        } catch {
            notify.error("Не удалось сохранить пожелания");
        }
    }, [dispatch, refresh, notify]);

    const handleBecomeTracker = useCallback(async () => {
        if (!orderId || !userId) return;
        try {
            await dispatch(assignTrackerToOrder({orderId, trackerId: userId}));
            await refresh();
            toggleSidebar();
        } catch {
            notify.error("Не удалось назначить вас трекером.");
        }
    }, [dispatch, orderId, userId, refresh, toggleSidebar, notify]);

    type SaveField = { field: 'title' | 'deadline'; value: string };

    const handleSaveAll = useCallback(
        async (changes: SaveField[]) => {
            for (const change of changes) {
                if (change.field === 'title') {
                    await dispatch(
                        updateOrderTitle({
                            orderId,
                            projectName: change.value,
                            currentStatus: order.status as OrderStatus,
                        })
                    );
                } else if (change.field === 'deadline') {
                    await dispatch(
                        updateOrderDeadline({
                            orderId,
                            projectDeadline: change.value,
                        })
                    );
                }
            }
            await refresh();
        },
        [dispatch, order.status, orderId, refresh]
    );

    if (!order) {
        return <div>Loading order...</div>;
    }

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
                        <Header
                            client={order.client}
                            onClientChat={handleClientChat}
                        />

                        {/* TITLE */}
                        <div className={classes.title}>
                            <EditableField
                                value={order.project_name || order.order_name || ""}
                                onSave={(newTitle) => handleSaveAll([{field: 'title', value: newTitle}])}
                                canEdit={[OrderStatus.InProgress, OrderStatus.Matching].includes(order.status as OrderStatus)}
                                type="text"
                                placeholder="Название заявки"
                                displayFormatter={(v) => v || `Заявка № ${order.id}`}
                            />
                        </div>

                        {/* DEADLINES */}
                        <DeadlinesSection
                            status={order.status as OrderStatus}
                            project_deadline={order.project_deadline || null}
                            updated_at={order.updated_at}
                            created_at={order.created_at}
                            onDeadlineSave={(newDate) => handleSaveAll([{field: 'deadline', value: newDate}])}
                        />

                        {/* BUDGET & TRACKER */}
                        <div className={classes.funnelInfo}>
                            <div className={classes.sum}>
                                <p>Бюджет</p>
                                {isEditingBudget ? (
                                    <input
                                        className={classes.budgetInput}
                                        value={budgetValue}
                                        onChange={(e) => setBudgetValue(e.target.value)}
                                        onBlur={() => setIsEditingBudget(false)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") setIsEditingBudget(false);
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                        onClick={() => {
                                            if (order.status === OrderStatus.Matching) {
                                                setIsEditingBudget(true);
                                            }
                                        }}
                                        title="Нажмите для редактирования"
                                    >
                    {budgetValue ? `${budgetValue} ₽` : "—"}
                  </span>
                                )}
                            </div>

                            <div className={classes.sum}>
                                <p>Трекер</p>

                                {order.tracker_data?.custom_user?.full_name ? (
                                    <div className={classes.trackers}>
                    <span
                        className={classes.avatarPlaceholder}
                        title={order.tracker_data.custom_user.full_name}
                        aria-label={order.tracker_data.custom_user.full_name}
                    >
                      {order.tracker_data.custom_user.full_name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")}
                    </span>
                                    </div>
                                ) : (
                                    <span>—</span>
                                )}
                            </div>
                        </div>
                        <InfoSection
                            status={order.status as OrderStatus}
                            solving_problems={order.solving_problems || ""}
                            product_or_service={order.product_or_service || ""}
                            order_goal={order.order_goal || ""}
                            extra_wishes={order.extra_wishes || ""}
                            onEditGoal={handleGoalEdit}
                            onEditProductOrService={handleProductEdit}
                            onEditSolvingProblems={handleProblemsEdit}
                            onEditExtraWishes={handleExtraEdit}
                        />

                        {/* NOTE */}
                        <div className={classes.blok_paragraph}>
                            <h3>Заметка по заявке</h3>
                            <div className={classes.paragraph}>
                                <p>{"//TODO Комментариев нет"}</p>
                            </div>
                        </div>

                        {order.status === OrderStatus.Matching && (
                            <>
                                <div className={classes.invitedHeader}>
                                    <h4>Приглашённые специалисты</h4>
                                    <div className={classes.actions}>
                                        <span>принять</span>
                                        <span>оплата</span>
                                    </div>
                                </div>

                                <div className={classes.plusWrapper}>
                                    <img
                                        src={Plus}
                                        alt="Добавить"
                                        className={classes.plusIcon}
                                        onClick={() => navigate("/manager/specialists")}
                                        title="Добавить специалиста"
                                    />
                                </div>

                                <InvitedSpecialistsList
                                    items={invitedSpecialists}
                                    onApprove={async (id) => {
                                        await dispatch(approveInvitation(id));
                                        await refresh();
                                    }}
                                    onReject={(id) =>
                                        dispatch(rejectInvitation(id)).then(refresh)
                                    }
                                    onUpdatePayment={async (id, payment) => {
                                        await dispatch(updateInvitationPayment({
                                            invitationId: id,
                                            proposedPayment: Number(payment)
                                        }));
                                        await refresh();
                                    }}
                                />
                            </>
                        )}

                        {order.status !== OrderStatus.InProgress && order.status !== OrderStatus.NewOrder && (
                            <>
                                <div className={classes.invitedHeader}>
                                    <h4>Приглашённые специалисты</h4></div>
                                <ApprovedSpecialistsList items={approvedSpecialists}/>
                            </>
                        )}

                        {/* SUBTASKS */}
                        <SubTasks
                            orderId={order.id}
                            onAddSubtask={(text) => {
                                // пока можно оставить заглушкой или логом
                                console.log("subtask added", text);
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
                                if (order.status === OrderStatus.Matching) {
                                    const parsedBudget = parseFloat(budgetValue);
                                    if (
                                        !budgetValue.trim() ||
                                        isNaN(Number(budgetValue)) ||
                                        Number(budgetValue) <= 0
                                    ) {
                                        notify.error(
                                            "Укажите корректный утверждённый бюджет (больше 0), прежде чем переходить к следующему этапу."
                                        );
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
                                } else if (order.status === OrderStatus.InProgress) {
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
