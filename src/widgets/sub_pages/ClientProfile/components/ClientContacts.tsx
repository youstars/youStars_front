import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import styles from "../ClientProfile.module.scss";

interface ClientContactsProps {
    edit: boolean;
    form: {
        phone_number: string;
        email: string;
        tg_nickname: string;
    };
    onChange: (
        field: "phone_number" | "email" | "tg_nickname"
    ) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    user: {
        phone_number?: string;
        email?: string;
        tg_nickname?: string;
    };
}

const ClientContacts: React.FC<ClientContactsProps> = ({
                                                           edit,
                                                           form,
                                                           onChange,
                                                           user,
                                                       }) => (
    <div className={styles.clientContacts}>
        {edit ? (
            <>
                <input
                    className={styles.inputField}
                    value={form.phone_number}
                    onChange={onChange("phone_number")}
                    placeholder="Телефон"
                />
                <input
                    className={styles.inputField}
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="E-mail"
                />
                <input
                    className={styles.inputField}
                    value={form.tg_nickname}
                    onChange={onChange("tg_nickname")}
                    placeholder="TG ник"
                />
            </>
        ) : (
            <>
                <p className={styles.clientContact}>
                    <img src={Phone} alt="Телефон" />
                    {user.phone_number || "Не указан"}
                </p>
                <p className={styles.clientContact}>
                    <img src={Mail} alt="E‑mail" />
                    {user.email || "Не указан"}
                </p>
                <p className={styles.clientContact}>
                    <img src={Web} alt="TG ник" />
                    {user.tg_nickname || "Не указан"}
                </p>
            </>
        )}
    </div>
);

export default ClientContacts;



// --- end extracted sub‑components --- //
