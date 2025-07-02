import React from "react";
import classes from "../../SideFunnel.module.scss";
import { Calendar, Clock } from "lucide-react";
import EditableField from "../../components/EditableField/EditableField";
import { formatDate } from "shared/helpers/userUtils";
import { OrderStatus } from "../../SideFunnel";

/** Блок отображения одного дедлайна */
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

export interface DeadlinesSectionProps {
    /** Текущий статус заказа */
    status: OrderStatus;
    /** Основной дедлайн статуса */
    project_deadline: string | null;
    /** Время обновления статуса */
    updated_at: string;
    /** Время создания заказа */
    created_at: string;
    /** Коллбэк для сохранения нового дедлайна */
    onDeadlineSave: (newDate: string) => void;
}

const DeadlinesSection: React.FC<DeadlinesSectionProps> = ({
                                                               status,
                                                               project_deadline,
                                                               updated_at,
                                                               created_at,
                                                               onDeadlineSave,
                                                           }) => (
    <div className={classes.time_block}>
        {/* Редактируемый дедлайн статуса */}
        <div className={classes.project_name}>
            <p>Дедлайн статуса</p>
            <div className={classes.fidback}>
                <Calendar size={14} className={classes.icon} />
                <EditableField
                    value={project_deadline || ""}
                    onSave={onDeadlineSave}
                    canEdit={[OrderStatus.InProgress, OrderStatus.Matching].includes(status)}
                    type="date"
                    displayFormatter={(v) => formatDate(v)}
                />
            </div>
        </div>

        {/* Остальные временные метки */}
        <DeadlineBlock
            label="Начало статуса"
            icon={<Calendar size={14} className={classes.icon} />}
            value={formatDate(updated_at)}
        />
        <DeadlineBlock
            label="Последний контакт с заказчиком"
            icon={<Calendar size={14} className={classes.icon} />}
            value={formatDate(updated_at)}
        />
        <DeadlineBlock
            label="Создано"
            icon={<Clock size={14} className={classes.icon} />}
            value={formatDate(created_at)}
        />
    </div>
);

export default DeadlinesSection;