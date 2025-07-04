import React from "react";
import classes from "../Clients.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import star from "shared/images/star.svg";
import {formatCurrency} from "shared/helpers/formatCurrency";
import {useNavigate} from "react-router-dom";

interface ClientCardProps {
    client: any;          // TODO: заменить на строгий интерфейс Client
}

const ClientCard: React.FC<ClientCardProps> = ({client}) => {
    const navigate = useNavigate();

    return (
        <div
            className={classes.all_blocks}
            onClick={() => navigate(`/manager/clients/${client.id}`)}
            style={{cursor: "pointer"}}
        >
            <div className={classes.img_job_title}>
                <div className={classes.img}>
                    <Avatar
                        src={client.custom_user.avatar}
                        alt={client.custom_user.full_name}
                        size="60px"
                    />
                </div>

                <div className={classes.content}>
                    <p>{client.business_name || "Компания не указана"}</p>
                    <h3>{client.custom_user.full_name}</h3>
                    <p className={classes.description}>
                        {client.description || "Описание отсутствует"}
                    </p>
                </div>

                <div
                    className={classes.send_message}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img src={star} alt="star"/>
                    <button className={classes.button}>Написать клиенту</button>
                </div>
            </div>

            <div className={classes.payment_block}>
                <div className={classes.payment_text}>
                    <p>
                        Заказов на сумму:{" "}
                        <span>{formatCurrency(client.orders_total)}</span>
                    </p>
                    <p>
                        Средний чек: <span>{formatCurrency(client.order_cost_avg)}</span>
                    </p>
                    <p>
                        Настроение:{" "}
                        <span>
              {(client.mood ?? client.overall_rating ?? "—") + "/5"}
            </span>
                    </p>
                </div>

                <div className={classes.payment_text}>
                    <p>
                        Активные заявки: <span>{client.orders_in_progress ?? "—"}</span>
                    </p>
                    <p>
                        Все проекты: <span>{client.projects_count ?? "—"}</span>
                    </p>
                    <p className="todo">
                        Дата последнего контакта:{" "}
                        <span>
              {client.last_contact_date
                  ? new Date(client.last_contact_date).toLocaleDateString()
                  : "—"}
            </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ClientCard);