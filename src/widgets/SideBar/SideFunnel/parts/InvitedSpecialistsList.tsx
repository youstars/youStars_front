import React from "react";
import classes from "../SideFunnel.module.scss"
import InvitationStatus from "widgets/SideBar/SideFunnel/InvitationStatus/InvitationStatus";
import Approve from "shared/images/sideBarImgs/fi-br-checkbox.svg";
import Decline from "shared/images/sideBarImgs/Checkbox.svg";

interface SpecialistUser {
    full_name: string | null;
}

interface InvitationEntry {
    id: number;
    specialist: { custom_user: SpecialistUser } | null;
    status: string;
    is_approved: boolean;
    proposed_payment: string | null;
}

interface Props {
    items: InvitationEntry[];
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

const InvitedSpecialistsList: React.FC<Props> = ({
                                                     items,
                                                     onApprove,
                                                     onReject,
                                                 }) => {
    if (!items.length) return <div className={classes.empty}>Нет приглашённых</div>;

    return (
        <div className={classes.list}>
            {items.map((entry) => {
                const user = entry.specialist?.custom_user;
                return (
                    <div key={entry.id} className={classes.item}>
                        <div className={classes.avatar} />
                        <div className={classes.name}>
                            <InvitationStatus
                                status={entry.status}
                                isApproved={entry.is_approved}
                            />
                            {user?.full_name || "Без имени"}
                        </div>

                        <div className={classes.actions}>
                            <button
                                className={classes.approve}
                                onClick={() => onApprove(entry.id)}
                                disabled={entry.is_approved}
                                title="Подтвердить"
                            >
                                <img src={Approve} alt="✔" />
                            </button>
                            <button
                                className={classes.reject}
                                onClick={() => onReject(entry.id)}
                                title="Отклонить"
                            >
                                <img src={Decline} alt="✖" />
                            </button>
                        </div>

                        <div className={classes.payment}>
                            {entry.proposed_payment || "—"}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InvitedSpecialistsList;