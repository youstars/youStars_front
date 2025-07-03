import React, { useState } from "react";
import classes from "./InvitedSpecialistsList.module.scss"
import InvitationStatus from "widgets/SideBar/SideFunnel/InvitationStatus/InvitationStatus";
import Approve from "shared/images/sideBarImgs/fi-br-checkbox.svg";
import Decline from "shared/images/sideBarImgs/Checkbox.svg";
import Avatar from "shared/UI/AvatarMini/Avatar";
import {PenBox} from "lucide-react";

interface SpecialistUser {
    full_name: string | null;
    avatar: any;
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
    onUpdatePayment: (id: number, payment: string) => void;
}

const InvitedSpecialistsList: React.FC<Props> = ({
                                                     items,
                                                     onApprove,
                                                     onReject,
                                                     onUpdatePayment,
                                                 }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [paymentValue, setPaymentValue] = useState<string>("");

    if (!items.length) return <div className={classes.empty}>Нет приглашённых</div>;

    return (
        <div className={classes.invitedList}>
            {items.map((entry) => {
                const user = entry.specialist?.custom_user;
                return (
                    <div key={entry.id} className={classes.invitedItem}>
                        <Avatar
                            avatar={user?.avatar}
                            fullName={user?.full_name}
                            size="sm"
                            className={classes.avatar}
                        />
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
                                <img src={Approve} alt="✔"/>
                            </button>
                            <button
                                className={classes.reject}
                                onClick={() => onReject(entry.id)}
                                title="Отклонить"
                            >
                                <img src={Decline} alt="✖"/>
                            </button>
                        </div>

                        <div className={classes.payment}>
                            {editingId === entry.id ? (
                                <>
                                    <input
                                        type="text"
                                        className={classes.paymentInput}
                                        value={paymentValue}
                                        onChange={(e) => setPaymentValue(e.target.value)}
                                    />
                                    <button
                                        className={classes.savePayment}
                                        onClick={() => {
                                            onUpdatePayment(entry.id, paymentValue);
                                            setEditingId(null);
                                        }}
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        className={classes.cancelPayment}
                                        onClick={() => setEditingId(null)}
                                    >
                                        Отмена
                                    </button>
                                </>
                            ) : (
                                <>
                                    {entry.proposed_payment || "—"}
                                    <PenBox
                                        size={16}
                                        className={classes.editIcon}
                                        onClick={() => {
                                            setEditingId(entry.id);
                                            setPaymentValue(entry.proposed_payment || "");
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InvitedSpecialistsList;