import React, {useState} from "react";
import classes from "../SideFunnel.module.scss"
import {OrderStatus} from "../SideFunnel";          // путь относительно вашей структуры
import {getInitials} from "shared/helpers/userUtils";

interface OrderInfoProps {
    status: OrderStatus;
    initialBudget: string;
    trackerName: string | null;
    /** Изменённый бюджет отдаётся наружу. */
    onBudgetChange: (value: string) => void;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({
                                                        status,
                                                        initialBudget,
                                                        trackerName,
                                                        onBudgetChange,
                                                    }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialBudget);

    const canEditBudget = status === OrderStatus.Matching;

    return (
        <section className={classes.wrapper}>
            <div className={classes.sum}>
                <p className={classes.label}>Бюджет</p>

                {isEditing ? (
                    <input
                        className={classes.input}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => {
                            setIsEditing(false);
                            if (value !== initialBudget) onBudgetChange(value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setIsEditing(false);
                                if (value !== initialBudget) onBudgetChange(value);
                            }
                        }}
                        autoFocus
                    />
                ) : (
                    <span
                        className={classes.value}
                        onClick={() => canEditBudget && setIsEditing(true)}
                        title={canEditBudget ? "Редактировать бюджет" : ""}
                    >
            {initialBudget || "—"}
          </span>
                )}
            </div>

            <div className={classes.sum}>
                <p className={classes.label}>Трекер</p>
                <span className={classes.tracker}>
          {trackerName ? (
              <span className={classes.trackerAvatar}>{getInitials(trackerName)}</span>
          ) : (
              "—"
          )}
        </span>
            </div>
        </section>
    );
};

export default OrderInfo;