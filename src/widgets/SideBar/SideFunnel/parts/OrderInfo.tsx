import React from "react";
import classes from "../SideFunnel.module.scss"
import {OrderStatus} from "../SideFunnel";          // путь относительно вашей структуры

interface InfoCardProps {
    title: string;
    text: string;
    onEdit?: () => void;
    updatedAt?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({title, text, onEdit, updatedAt}) => (
    <div className={classes.card}>
        <div className={classes.cardHeader}>
            <h4>{title}</h4>
            {updatedAt && <span className={classes.date}>{updatedAt}</span>}
            {onEdit && (
                <button className={classes.editButton} onClick={onEdit} title="Редактировать">
                    ✎
                </button>
            )}
        </div>
        <p className={classes.cardBody}>{text || "—"}</p>
    </div>
);

interface OrderInfoProps {
    status: OrderStatus;
    solving_problems: string;
    product_or_service: string;
    order_goal: string;
    extra_wishes: string;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({
                                                        solving_problems,
                                                        product_or_service,
                                                        order_goal,
                                                        extra_wishes,
                                                    }) => {

    return (
        <section className={classes.wrapper}>

            <InfoCard
                title="Запрос"
                text={order_goal}
            />

            <InfoCard
                title="Продукт или услуга"
                text={product_or_service}
            />

            <InfoCard
                title="Проблемы"
                text={solving_problems}
            />

            <InfoCard
                title="Доп. пожелания"
                text={extra_wishes}
            />
        </section>
    );
};

export default OrderInfo;