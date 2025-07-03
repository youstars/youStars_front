import React from 'react';
import styles from './TaskCard.module.scss';
import chatIcon from 'shared/images/chat.svg';
import chatIcons from 'shared/images/chats.svg';
import Avatar from 'shared/UI/AvatarMini/Avatar';
import {formatCurrency} from 'shared/helpers/formatCurrency';
import type {Order} from 'shared/types/orders';
import {formatDate} from "shared/utils/formatDate";

export interface TaskCardProps {
    order: Order;
    onSelect: (orderId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = React.memo(({order, onSelect}) => {
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
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(id);
            }}
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
                        <button type="button" className={styles.taskActionButton} aria-label="Открыть чат">
                            <img src={chatIcon} alt="чат"/>
                        </button>
                        <button type="button" className={styles.taskActionButton} aria-label="Открыть список чатов">
                            <img src={chatIcons} alt="чаты"/>
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
              <span>{formatDate(updated_at)}</span>
            </span>
                    </div>

                    <div className={styles.taskDetailItem}>
                        <span className={styles.taskDetailLabel}>Трекер:</span>
                        <span className={styles.taskDetailValue}>
              {tracker_data?.custom_user ? (
                <Avatar
                  avatar={(tracker_data.custom_user as any).avatar}
                  fullName={tracker_data.custom_user.full_name}
                  size="xs"
                  className={styles.avatarCircle}
                />
              ) : (
                <span className={styles.avatarCircle}>–</span>
              )}
            </span>
                    </div>

                    <div className={styles.taskDetailItem}>
                        <span className={styles.taskDetailLabel}>Специалисты:</span>
                        <span className={styles.taskDetailValue}>
              {(approved_specialists || [])
                  .slice(0, 2)
                  .map((spec) => (
                      <Avatar
                        key={spec.id}
                        avatar={(spec.custom_user as any)?.avatar}
                        fullName={spec.custom_user?.full_name ?? `ID ${spec.id}`}
                        size="xs"
                        className={styles.avatarCircle}
                      />
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