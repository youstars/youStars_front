import React from "react";
import classes from "../SideFunnel.module.scss"


interface SpecialistUser {
    full_name: string | null;
}

interface Specialist {
    id: number;
    custom_user: SpecialistUser | null;
}

interface Props {
    items: Specialist[];
}

const ApprovedSpecialistsList: React.FC<Props> = ({ items }) => {
    if (!items.length) {
        return <div className={classes.empty}>Нет утверждённых специалистов</div>;
    }

    return (
        <div className={classes.list}>
            {items.map((spec) => (
                <div key={spec.id} className={classes.item}>
                    <div className={classes.statusIcon}>✅</div>
                    <div className={classes.avatar} />
                    <div className={classes.name}>
                        {spec.custom_user?.full_name || "Без имени"}
                    </div>
                    <div className={classes.payment}>—</div>
                </div>
            ))}
        </div>
    );
};

export default ApprovedSpecialistsList;