import React from 'react';
import styles from 'widgets/sub_pages/Funnel/Funnel.module.scss';
import chatIcon from 'shared/images/chat.svg';
import chatIcons from 'shared/images/chats.svg';
import { getInitials } from 'shared/helpers/userUtils';
import { formatCurrency } from 'shared/helpers/formatCurrency';

import type { Order } from 'shared/types/orders';

export interface TaskCardProps {
    order: Order;
    onSelect: (orderId: number) => void;
}

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "Дата не указана";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
        ? "Неверная дата"
        : date.toLocaleDateString("ru-RU");
};

const TaskCard: React.FC<TaskCardProps> = React.memo(({ order, onSelect }) => {
    const {
        id,
        project_name,
        order_name,
        client,
        approved_budget,
        estimated_budget,
        created_at,
        updated_at,
        tracker_data,
        approved_specialists,
    } = order;

    return (
        <div
            className={styles.taskCard}
            onClick={() => onSelect(id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') onSelect(id); }}
        >
            <div className={styles.taskContent}>
                <div className={styles.taskHeader}>
                    <div>
                        <h3 className={styles.taskTitle}>
                            {project_name || order_name || `Заявка №${id}`}
                        </h3>
                        <p className={styles.description}>
                            Клиент{' '}
                            {client?.custom_user?.full_name || `ID ${client?.id}`}
                        </p>
                    </div>
                    <div className={styles.taskActions}>
                        <button className={styles.taskActionButton}>
                            <img src={chatIcon} alt="чат" />
                        </button>
                        <button className={styles.taskActionButton}>
                            <img src={chatIcons} alt="чаты" />
                        </button>
                    </div>
                </div>

                <p className={styles.amount}>
                    {formatCurrency(approved_budget, estimated_budget)}
                </p>

                <div className={styles.taskDetails}>
                    <div className={styles.taskDetailItem}>
                        <span className={styles.taskDetailLabel}>Начало статуса:</span>
                        <span className={styles.taskDetailValue}>
              {formatDate(created_at)}
            </span>
                    </div>

                    <div className={styles.taskDetailItem}>
                        <span className={styles.taskDetailLabel}>Посл. контакт:</span>
                        <span className={styles.taskDetailValue}>
              <u>{formatDate(updated_at)}</u>
            </span>
                    </div>

                    <div className={styles.taskDetailItem}>
                        <span className={styles.taskDetailLabel}>Трекер:</span>
                        <span className={styles.taskDetailValue}>
              <span className={styles.avatarCircle}>
                {tracker_data?.custom_user?.full_name
                    ? getInitials(tracker_data.custom_user.full_name)
                    : '–'}
              </span>
            </span>
                    </div>

                    <div className={styles.taskDetailItem}>
                        <span className={styles.taskDetailLabel}>Специалисты:</span>
                        <span className={styles.taskDetailValue}>
              {(approved_specialists || [])
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
                            {approved_specialists && approved_specialists.length > 2 && (
                                <span className={styles.avatarMore}>...</span>
                            )}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TaskCard;