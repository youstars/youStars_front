import React, { useState, useEffect } from "react";
import styles from "./InvitationMessage.module.scss";
import { Button } from "shared/index";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import {
  getInvitationDetails,
  respondToInvitation,
} from "shared/store/slices/invitationSlice";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getCookie } from "shared/utils/cookies";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

interface Props {
  invitation: {
    id: number;
    order_name: string;
    order_id?: number;
    project_deadline: string | null;
    expires_at: string;
    status: string;
  };
}

const InvitationMessage: React.FC<Props> = ({ invitation }) => {
  const dispatch = useAppDispatch();
  const [localStatus, setLocalStatus] = useState(invitation.status);
  const [isAdmin, setIsAdmin] = useState(false);
  const { details, status } = useSelector(
    (state: RootState) => state.invitation
  );

  useEffect(() => {
    const role = getCookie("user_role");
    setIsAdmin(role?.toLowerCase() === "admin");
  }, []);

  useEffect(() => {
    dispatch(getInvitationDetails(invitation.id));
  }, [dispatch, invitation.id]);

  const handleApprove = () => {
    setLocalStatus("ACCEPTED");
    dispatch(respondToInvitation({ id: invitation.id, status: "ACCEPTED" }));
  };

  const handleReject = () => {
    setLocalStatus("DECLINED");
    dispatch(respondToInvitation({ id: invitation.id, status: "DECLINED" }));
  };

  const formattedDeadline = invitation.project_deadline
    ? format(new Date(invitation.project_deadline), "d MMMM yyyy, HH:mm", {
        locale: ru,
      })
    : "не указан";
  const formattedExpires = format(
    new Date(invitation.expires_at),
    "d MMMM yyyy, HH:mm",
    {
      locale: ru,
    }
  );

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
      <div className={styles.infoBlock}>
        <div className={styles.grid}>
          <p className={styles.detail}>
            <strong>Название:</strong> {invitation.order_name}
          </p>
          <p className={styles.detail}>
            <strong>Дедлайн:</strong> {formattedDeadline}
          </p>
          <p className={styles.detail}>
            <strong>Ответить до:</strong> {formattedExpires}
          </p>
          {details && (
            <>
              <p className={styles.detail}>
                <strong>Цель:</strong> {details.order_goal}
              </p>
              <p className={styles.detail}>
                <strong>Трекер:</strong> {details.tracker_name}
              </p>
              <p className={styles.detail}>
                <strong>Оплата:</strong> {details.proposed_payment} €
              </p>
            </>
          )}
        </div>
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