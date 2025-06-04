import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  MessagesSquare,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckSquare,
  PlusSquare,
} from "lucide-react";
import classes from "./SideFunnel.module.scss";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { getFunnelData } from "shared/store/slices/funnelSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { getUserIdFromToken } from "shared/utils/cookies";
import { useNavigate } from "react-router-dom";
import Plus from "shared/assets/icons/plus.svg";
import {
  updateOrderTitle,
  assignTrackerToOrder,
  getOrderById,
} from "shared/store/slices/orderSlice";
import {
  approveInvitation,
  rejectInvitation,
} from "shared/store/slices/invitationSlice";
import { updateOrderStatus } from "shared/store/slices/orderSlice";
import { formatDate, getInitials } from "shared/helpers/userUtils";
import Approve from "shared/images/sideBarImgs/fi-br-checkbox.svg";
import Decline from "shared/images/sideBarImgs/Checkbox.svg";
import { useChatService } from "shared/hooks/useWebsocket";
import { findChatByParticipantId } from "shared/helpers/chatUtils";
import ChatsIcon from "shared/assets/icons/ChatsY.svg";
import ChatIcon from "shared/assets/icons/chatY.svg";

interface SideFunnelProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  orderId: string;
}

const ExpandableText: React.FC<{ text: string; maxLength?: number }> = ({
  text,
  maxLength = 100,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <div className={classes.expandableBlock}>
      <p className={classes.expandableText}>
        {expanded || !isLong ? text : `${text.slice(0, maxLength)}... `}
        {isLong && (
          <button
            className={classes.toggleLink}
            onClick={toggleExpanded}
            type="button"
          >
            {expanded ? "Скрыть" : "Дальше"}
          </button>
        )}
      </p>
    </div>
  );
};

const SideFunnel: React.FC<SideFunnelProps> = ({
  isOpen,
  toggleSidebar,
  orderId,
}) => {
  const { chats, setActiveChat } = useChatService();

  const handleClientChat = () => {
    const clientUserId = order.client?.custom_user?.id;
    const chat = findChatByParticipantId(chats, clientUserId);

    if (chat) {
      setActiveChat(chat.id);
      navigate("/manager/chats");
    } else {
      alert("Чат с этим клиентом не найден.");
    }
  };

  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(true);

  const order = useAppSelector((state) => state.order.current);

  const userId = getUserIdFromToken();
  const [editableTitle, setEditableTitle] = useState(
    order?.project_name || order?.order_name || ""
  );
  React.useEffect(() => {
    if (order) {
      setEditableTitle(order.project_name || order.order_name || "");
    }
  }, [order]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const dispatch = useAppDispatch();

  const handleTitleSave = async () => {
    if (!editableTitle.trim() || editableTitle === order.project_name) return;

    try {
      await dispatch(
        updateOrderTitle({
          orderId: order.id.toString(),
          projectName: editableTitle,
          currentStatus: String(order.status),
        })
      );

      await dispatch(getOrderById(order.id.toString()));
      await dispatch(getFunnelData());
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      setIsEditingTitle(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  const handleBecomeTracker = async () => {
    if (!orderId || !userId) return;
    console.log("CLICK — хочу стать трекером");
    await dispatch(assignTrackerToOrder({ orderId, trackerId: userId }));
    await dispatch(getFunnelData());
    toggleSidebar();
  };
  React.useEffect(() => {
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  if (!order) return null;

  const clientUser = order.client?.custom_user;
  const clientName =
    clientUser?.full_name || (order.client ? `ID ${order.client.id}` : "—");
  const clientInitials = getInitials(clientName);

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
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className={classes.contentWrapper}>
          <div className={classes.content}>
            {/* HEADER */}
            <header className={classes.header}>
              <div className={classes.bloks}>
                <div className={classes.user_img}>
                  {clientUser?.avatar ? (
                    <img
                      src={clientUser.avatar}
                      alt={clientName}
                      className={classes.avatarImg}
                    />
                  ) : (
                    <div className={classes.avatarCircle}>{clientInitials}</div>
                  )}
                </div>
                <div className={classes.user_name}>
                  <p>{clientName}</p>
                  <p>{order.client?.business_name || "Без компании"}</p>
                </div>

                <div className={classes.chats}>
                  <button
                    onClick={handleClientChat}
                    className={classes.chatButton}
                    title="Чат с клиентом"
                  >
                    <img
                      src={ChatIcon}
                      alt="Чат с клиентом"
                      className={classes.chatIcon}
                    />
                  </button>

                  <img
                    src={ChatsIcon}
                    alt="Чат с клиентом"
                    className={classes.chatIcon}
                  />
                </div>
              </div>
            </header>

            {/* TITLE */}
            <div className={classes.title}>
              {String(order.status) === "in_progress" && isEditingTitle ? (
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
                    if (String(order.status) === "in_progress")
                      setIsEditingTitle(true);
                  }}
                >
                  {editableTitle || `Заявка № ${order?.id}` || "Без названия"}
                </span>
              )}
            </div>

            {/* DEADLINES */}
            <div className={classes.time_block}>
              <div className={classes.project_name}>
                <p>Дедлайн статуса</p>
                <div className={classes.fidback}>
                  <Calendar size={14} className={classes.icon} />
                  <p>{formatDate(order.project_deadline)}</p>
                </div>
              </div>
              <div className={classes.project_name}>
                <p>Начало статуса</p>
                <div className={classes.fidback}>
                  <Calendar size={14} className={classes.icon} />
                  <p>12.02.2025</p>
                </div>
              </div>
              <div className={classes.project_name}>
                <p>Последний контакт с заказчиком</p>
                <div className={classes.fidback}>
                  <Calendar size={14} className={classes.icon} />
                  <p>{formatDate(order.updated_at)}</p>
                </div>
              </div>
              <div className={classes.project_name}>
                <p>Создано</p>
                <div className={classes.fidback}>
                  <Clock size={14} className={classes.icon} />
                  <p>{formatDate(order.created_at)}</p>
                </div>
              </div>
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
              <div className={classes.funnelInfo}>
                <div className={classes.sum}>
                  <p>Бюджет</p>
                  <span>{order.estimated_budget || "—"}</span>
                </div>
                <div className={classes.sum}>
                  <p>Трекер</p>
                  <span>-</span>
                </div>
              </div>
            )}

            {/* NOTE */}
            <div className={classes.blok_paragraph}>
              <h3>Заметка по заявке</h3>
              <div className={classes.paragraph}>
                <p>{order.extra_wishes || "Комментариев нет"}</p>
              </div>
            </div>
            {String(order.status) === "matching" && (
              <>
                {/* Приглашённые специалисты */}
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

                <div className={classes.invitedList}>
                  {order.invited_specialists.map((entry, index) => {
                    const user = entry.specialist?.custom_user;
                    const statusIcon =
                      entry.is_approved === true
                        ? "✅"
                        : entry.status === "REJECTED"
                        ? "❌"
                        : "⏳";

                    return (
                      <div key={index} className={classes.invitedItem}>
                        <div className={classes.statusIcon}>{statusIcon}</div>
                        <div className={classes.avatar} />
                        <div className={classes.name}>
                          {user?.full_name || "Без имени"}
                        </div>
                        <div className={classes.actionIcons}>
                          <button
                            className={classes.approve}
                            onClick={async () => {
                              await dispatch(approveInvitation(entry.id));
                              await dispatch(getOrderById(orderId));
                            }}
                            disabled={entry.is_approved}
                            title="Подтвердить"
                          >
                            <img src={Approve} alt="Подтвердить" />
                          </button>
                          <button
                            className={classes.reject}
                            onClick={() => {
                              dispatch(rejectInvitation(entry.id)).then(() =>
                                dispatch(getOrderById(orderId))
                              );
                            }}
                            title="Отклонить"
                          >
                            <img src={Decline} alt="Отклонить" />
                          </button>
                        </div>

                        <div className={classes.payment}>
                          {entry.proposed_payment || "—"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Утверждённые специалисты */}
                {/* Утверждённые специалисты */}
                <div className={classes.title}>Утверждённые специалисты</div>
                <div className={classes.invitedList}>
                  {order.approved_specialists?.length ? (
                    order.approved_specialists.map((spec, index) => {
                      const user = spec.custom_user;
                      return (
                        <div key={index} className={classes.invitedItem}>
                          <div className={classes.statusIcon}>✅</div>
                          <div className={classes.avatar} />
                          <div className={classes.name}>
                            {user?.full_name || "Без имени"}
                          </div>
                          <div className={classes.payment}>—</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={classes.project_card}>
                      Нет утверждённых специалистов
                    </div>
                  )}
                </div>

                {/* Файлы */}
                <div className={classes.uploadWrapper}>
                  <div className={classes.uploadHeader}>
                    <p>Файлы заявки</p>
                    <div className={classes.uploadIcon}>
                      <Upload size={16} className={classes.icon} />
                    </div>
                  </div>
                  <div className={classes.uploadBody}>
                    <ul className={classes.fileList}>
                      <li className={classes.fileItem}>📎 КП</li>
                      <li className={classes.fileItem}>📎 ТЗ</li>
                      <li className={classes.fileItem}>📎 Договор</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {/* SUBTASKS */}
            <div className={classes.subtasksWrapper}>
              <div
                className={classes.subtasksHeader}
                onClick={() => setIsSubtasksOpen((prev) => !prev)}
              >
                <h3>Подзадачи</h3>
                <span
                  className={`${classes.arrow} ${
                    isSubtasksOpen ? classes.up : ""
                  }`}
                />
              </div>

              {isSubtasksOpen && (
                <div className={classes.subtasksContent}>
                  <div className={classes.check_block}>
                    <CheckSquare size={14} className={classes.icon} />
                    <p>Прислать счёт об оплате</p>
                  </div>
                  <div className={classes.plus_block}>
                    <PlusSquare size={14} className={classes.icon} />
                    <p>Новая задача</p>
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON */}
            <button
              className={classes.submitButton}
              onClick={async () => {
                if (String(order.status) === "in_progress") {
                  await handleTitleSave();
                  await dispatch(getOrderById(orderId));
                  await dispatch(getFunnelData());
                } else if (String(order.status) === "matching") {
                  await dispatch(
                    updateOrderStatus({ orderId, newStatus: "prepayment" })
                  );
                  await dispatch(getOrderById(orderId));
                  await dispatch(getFunnelData());
                } else {
                  await handleBecomeTracker();
                  await dispatch(getOrderById(orderId));
                }
              }}
              disabled={
                (String(order.status) === "matching" &&
                  (!order.approved_specialists ||
                    order.approved_specialists.length === 0)) ||
                (String(order.status) === "in_progress" &&
                  order.order_name === `Заявка № ${order.id}`)
              }
            >
              {String(order.status) === "in_progress"
                ? "Мэтчинг"
                : String(order.status) === "matching"
                ? "Утвердить специалистов"
                : "Стать трекером"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideFunnel;
