import React, { useState, useRef, useEffect } from "react";
import classes from "../../SideFunnel.module.scss";
import OrderInfo from "../OrderInfo/OrderInfo";
import { OrderStatus } from "../../SideFunnel";

export interface InfoSectionProps {
    status: OrderStatus;
    solving_problems: string;
    product_or_service: string;
    order_goal: string;
    extra_wishes: string;
    onEditGoal: (newText: string) => void;
    onEditProductOrService: (newText: string) => void;
    onEditSolvingProblems: (newText: string) => void;
    onEditExtraWishes: (newText: string) => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({
                                                     status,
                                                     solving_problems,
                                                     product_or_service,
                                                     order_goal,
                                                     extra_wishes,
                                                     onEditGoal,
                                                     onEditProductOrService,
                                                     onEditSolvingProblems,
                                                     onEditExtraWishes,
                                                 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (panelRef.current) {
            panelRef.current.style.maxHeight = isOpen
                ? `${panelRef.current.scrollHeight}px`
                : "0px";
        }
    }, [isOpen, solving_problems, product_or_service, order_goal, extra_wishes]);

    return (
        <>
            <div className={classes.title}>
                Информация по заявке
                <span
                    className={`${classes.arrow} ${isOpen ? classes.up : ""}`}
                    onClick={() => setIsOpen((prev) => !prev)}
                />
            </div>
            <div
                ref={panelRef}
                className={classes.infoWrapper}
                style={{
                    maxHeight: isOpen
                        ? `${panelRef.current?.scrollHeight}px`
                        : "0px",
                }}
            >
                <OrderInfo
                    status={status}
                    solving_problems={solving_problems}
                    product_or_service={product_or_service}
                    order_goal={order_goal}
                    extra_wishes={extra_wishes}
                    onEditGoal={onEditGoal}
                    onEditProductOrService={onEditProductOrService}
                    onEditSolvingProblems={onEditSolvingProblems}
                    onEditExtraWishes={onEditExtraWishes}
                />
            </div>
        </>
    );
};

export default InfoSection;