import React from "react";
import classes from "../SideFunnel.module.scss"
import ChatIcon from "shared/assets/icons/chatY.svg";
import ChatsIcon from "shared/assets/icons/ChatsY.svg";
import {getInitials} from "shared/helpers/userUtils";

interface ClientUser {
    id: number;
    full_name: string | null;
    avatar: string | null;
}

interface SideFunnelHeaderProps {
    client: {
        id: number;
        custom_user: ClientUser | null;
        business_name: string | null;
    } | null;
    /** Открыть диалог с клиентом — вызывается по клику на одиночный chat-икон */
    onClientChat: () => void;
}

export const SideFunnelHeader: React.FC<SideFunnelHeaderProps> = ({
                                                                      client,
                                                                      onClientChat,
                                                                  }) => {
    const user = client?.custom_user;
    const clientName = user?.full_name || (client ? `ID ${client.id}` : "—");
    const initials = getInitials(clientName);

    return (
        <header className={classes.header}>
            <div className={classes.bloks}>
                {/* Аватар */}
                <div className={classes.user_img}>
                    {user?.avatar ? (
                        <img src={user.avatar} alt={clientName} className={classes.avatarImg}/>
                    ) : (
                        <div className={classes.avatarCircle}>{initials}</div>
                    )}
                </div>

                {/* Имя и компания */}
                <div className={classes.user_name}>
                    <p>{clientName}</p>
                    <p>{client?.business_name || "Без компании"}</p>
                </div>

                {/* Кнопки чатов */}
                <div className={classes.chats}>
                    <button
                        className={classes.chatButton}
                        onClick={onClientChat}
                        title="Чат с клиентом"
                    >
                        <img src={ChatIcon} alt="Чат с клиентом" className={classes.chatIcon}/>
                    </button>

                    {/* Общий чат (иконка без обработчика) */}
                    <img src={ChatsIcon} alt="Чат" className={classes.chatIcon}/>
                </div>
            </div>
        </header>
    );
};

export default SideFunnelHeader;