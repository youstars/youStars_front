import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useChatService} from "shared/hooks/useWebsocket";

export const useProjectChat = (projectId?: number) => {
    const {chats, setActiveChat} = useChatService();
    const navigate = useNavigate();

    const openProjectChat = useCallback(() => {
        if (!projectId) return;

        const chat = chats.find(
            (c) => c.chat_type === "admin-project" && Number(c.project) === projectId
        );

        if (chat) {
            setActiveChat(chat.id);
            navigate("/manager/chats");
        } else {
            // здесь можно кинуть toast или создать чат
            console.warn("Чат проекта не найден");
        }
    }, [chats, setActiveChat, navigate, projectId]);

    return {openProjectChat};
};