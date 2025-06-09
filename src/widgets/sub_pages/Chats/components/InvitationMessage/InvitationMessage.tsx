import React, { useState, useEffect } from "react";
import styles from "./InvitationMessage.module.scss";
import { Button } from "shared/index";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { respondToInvitation } from "shared/store/slices/invitationSlice";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getCookie } from "shared/utils/cookies";

interface Props {
  invitation: {
    id: number;
    order_name: string;
    project_deadline: string | null;
    expires_at: string;
    status: string;
  };
}

const InvitationMessage: React.FC<Props> = ({ invitation }) => {
  const dispatch = useAppDispatch();
  const [localStatus, setLocalStatus] = useState(invitation.status);
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const role = getCookie("user_role");
  setIsAdmin(role?.toLowerCase() === "admin");
}, []);


  const handleApprove = () => {
    setLocalStatus("ACCEPTED");
    dispatch(respondToInvitation({ id: invitation.id, status: "ACCEPTED" }));
  };

  const handleReject = () => {
    setLocalStatus("DECLINED");
    dispatch(respondToInvitation({ id: invitation.id, status: "DECLINED" }));
  };

  const formattedDeadline = invitation.project_deadline
    ? format(new Date(invitation.project_deadline), "d MMMM yyyy, HH:mm", { locale: ru })
    : "не указан";
  const formattedExpires = format(new Date(invitation.expires_at), "d MMMM yyyy, HH:mm", {
    locale: ru,
  });

  const isHandled = localStatus !== "PENDING";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>{invitation.order_name}</h4>
      <span className={styles.status} data-status={localStatus}>
  {localStatus === "PENDING"
    ? "Ожидает ответа"
    : localStatus === "ACCEPTED"
    ? "Принято"
    : localStatus === "DECLINED"
    ? "Отклонено"
    : localStatus}
</span>

      </div>
      <div className={styles.body}>
        <p className={styles.detail}>
          Дедлайн проекта: <strong>{formattedDeadline}</strong>
        </p>
        <p className={styles.detail}>
          Ответить до: <strong>{formattedExpires}</strong>
        </p>
      </div>
     {!isAdmin && !isHandled && (
  <div className={styles.actions}>
    <Button className={styles.accept} onClick={handleApprove}>
      Принять
    </Button>
    <Button className={styles.reject} onClick={handleReject}>
      Отклонить
    </Button>
  </div>
)}


    </div>
  );
};

export default InvitationMessage;
