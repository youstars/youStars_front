import React, {useState, useRef, useEffect} from "react";
import classes from "./OrderInfo.module.scss";
import {OrderStatus} from "../../SideFunnel";
import {PenBox} from "lucide-react";

interface InfoCardProps {
    title: string;
    text: string;
    onEdit?: (newText: string) => void;
    updatedAt?: string;
}

interface OrderInfoProps {
    status: OrderStatus;
    solving_problems: string;
    product_or_service: string;
    order_goal: string;
    extra_wishes: string;
    onEditGoal?: (newText: string) => void;
    onEditProductOrService?: (newText: string) => void;
    onEditSolvingProblems?: (newText: string) => void;
    onEditExtraWishes?: (newText: string) => void;
}


const InfoCard: React.FC<InfoCardProps> = ({title, text, onEdit, updatedAt}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const ta = textareaRef.current;
            ta.style.height = "auto";
            ta.style.height = `${ta.scrollHeight}px`;
        }
    }, [value, isEditing]);

    const handleSave = () => {
        onEdit?.(value);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setValue(text);
        setIsEditing(false);
    };

    return (
        <div className={classes.card}>
            <div className={classes.cardHeader}>
                <h4>{title}</h4>
                {updatedAt && <span className={classes.date}>{updatedAt}</span>}
                {!isEditing && onEdit && (
                    <PenBox
                        size={16}
                        className={classes.editIcon}
                        color="#FFC107"
                        onClick={() => setIsEditing(true)}
                    />
                )}
            </div>
            {isEditing ? (
                <>
                    <div className={classes.editControls}>
                        <textarea
                            className={classes.cardInput}
                            ref={textareaRef}
                            style={{overflow: "hidden"}}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <button type="button" className={classes.saveButton} onClick={handleSave}>
                            Сохранить
                        </button>
                        <button type="button" className={classes.cancelButton} onClick={handleCancel}>
                            Отменить
                        </button>
                    </div>
                </>
            ) : (
                <p className={classes.cardBody}>{text || "—"}</p>
            )}
        </div>
    );
};

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
                                                        onEditGoal,
                                                        onEditProductOrService,
                                                        onEditSolvingProblems,
                                                        onEditExtraWishes,
                                                    }) => {
    return (
        <section className={classes.wrapper}>
            <InfoCard
                title="Запрос"
                text={order_goal}
                onEdit={onEditGoal}
            />
            <InfoCard
                title="Продукт или услуга"
                text={product_or_service}
                onEdit={onEditProductOrService}
            />
            <InfoCard
                title="Проблемы"
                text={solving_problems}
                onEdit={onEditSolvingProblems}
            />
            <InfoCard
                title="Доп. пожелания"
                text={extra_wishes}
                onEdit={onEditExtraWishes}
            />
        </section>
    );
};

export default OrderInfo;
