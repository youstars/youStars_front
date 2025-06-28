import React, {useState, useMemo, useCallback} from "react";
import styles from "./BusinessApplicationCard.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import ProgressBar from "shared/UI/ProgressBar/ProgressBar";
import Chat from "shared/assets/icons/chat_yellow.svg";
import IconButton from "shared/UI/IconButton/IconButton";
import ApplicationCard from "shared/UI/ApplicationaCard/ApplicationCard";
import TextAreaField from "shared/UI/TextAreaField/TextAreaField";
import {Order} from "shared/types/orders";
import {useAppDispatch} from "shared/hooks/useAppDispatch";
import {updateOrder} from "shared/store/slices/orderSlice";
import {useNavigate} from "react-router-dom";

interface Props {
    order: Order;
}

export default function BusinessApplicationCard({order}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const [goal, setGoal] = useState(order.order_goal || "");
    const [problems, setProblems] = useState(order.solving_problems || "");
    const [product, setProduct] = useState(order.product_or_service || "");
    const [wishes, setWishes] = useState(order.extra_wishes || "");

    const statusStepsMap = {
        in_progress: "Обработка",
        matching: "Метчинг",
        prepayment: "Предоплата",
        working: "Работа",
        postpayment: "Постоплата",
        done: "Готово",
        feedback: "Отзыв",
    };

    const steps = Object.values(statusStepsMap);

    const currentStepIndex = useMemo(
        () =>
            steps.findIndex(
                (step) =>
                    step === statusStepsMap[order.status as keyof typeof statusStepsMap]
            ),
        [order.status]
    );

    const navigate = useNavigate();

    const handleNavigate = useCallback(() => {
        console.log("project_id", order.project_id);
        if (order.project_id) {
            navigate(`/manager/projects/${order.project_id}`);
        }
    }, [order.project_id, navigate]);

    const handleFieldBlur = useCallback(
        (field: keyof Order, originalValue: string, newValue: string) => {
            if (originalValue !== newValue) {
                dispatch(updateOrder({id: order.id, [field]: newValue}));
            }
        },
        [dispatch, order.id]
    );

    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
                <ApplicationCard
                    number={`№ ${order.id}`}
                    priceRange={order.estimated_budget || "—"}
                    dateRange={
                        order.project_deadline
                            ? new Date(order.project_deadline).toLocaleDateString()
                            : "Без срока"
                    }
                />

                <div className={styles.rank}>
                    <div className={styles.rankHeader}></div>
                    <div className={styles.progressBar}>
                        <ProgressBar
                            steps={steps}
                            currentStep={currentStepIndex === -1 ? 0 : currentStepIndex}
                        />
                    </div>
                </div>

                <div className={styles.rightBlock}>
                    <div className={styles.avatar} style={{cursor: "pointer"}}>
                        <Avatar size="40"/>
                        <h1
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate();
                            }}
                        >
                            {order.project_name || order.order_name}
                        </h1>
                    </div>
                    <IconButton icon={Chat} alt="chat" size="lg" borderColor="#FFD700"/>
                </div>
            </div>

            <div className={`${styles.projectDetails} ${isOpen ? styles.open : ""}`}>
                <TextAreaField
                    label="Задача проекта"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    onBlur={() =>
                        handleFieldBlur("order_goal", order.order_goal || "", goal)
                    }
                />

                <TextAreaField
                    label="Решаемые проблемы"
                    value={problems}
                    onChange={(e) => setProblems(e.target.value)}
                    onBlur={() =>
                        handleFieldBlur(
                            "solving_problems",
                            order.solving_problems || "",
                            problems
                        )
                    }
                />

                <TextAreaField
                    label="Продукт или услуга"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    onBlur={() =>
                        handleFieldBlur(
                            "product_or_service",
                            order.product_or_service || "",
                            product
                        )
                    }
                />

                <TextAreaField
                    label="Дополнительные пожелания"
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    onBlur={() =>
                        handleFieldBlur("extra_wishes", order.extra_wishes || "", wishes)
                    }
                />
            </div>
        </div>
    );
}
