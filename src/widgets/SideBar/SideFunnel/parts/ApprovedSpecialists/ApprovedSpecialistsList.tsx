import React from "react";
import classes from "./ApprovedSpecialistsList.module.scss"
import {getInitials} from "shared/helpers/userUtils";

interface SpecialistUser {
    full_name: string | null;
    avatar: any;
}

interface Specialist {
    id: number;
    custom_user: SpecialistUser | null;
}

interface Props {
    items: Specialist[];
}

const ApprovedSpecialistsList: React.FC<Props> = ({items}) => {
    if (!items.length) {
        return <div className={classes.empty}>Нет утверждённых специалистов</div>;
    }

    return (
        <div className={classes.ApprovedList}>
            {items.map((spec) => (
                <div key={spec.id} className={classes.ApprovedItem}>
                    <div className={classes.specialistsInfo}>
                        <div className={classes.avatar}>
                            {spec.custom_user?.avatar ? (
                                <img
                                    src={spec.custom_user.avatar}
                                    alt={spec.custom_user?.full_name || "avatar"}
                                />
                            ) : (
                                <span className={classes.initials}>
                                {getInitials(spec.custom_user?.full_name)}
                            </span>
                            )}
                        </div>
                        <div className={classes.name}>
                            {spec.custom_user?.full_name || "Без имени"}
                        </div>
                    </div>
                    <div className={classes.payment}>—</div>
                </div>
            ))}
        </div>
    );
};

export default ApprovedSpecialistsList;