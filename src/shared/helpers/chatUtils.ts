import { Chat } from "shared/types/chat";

export const findChatByParticipantId = (
  chats: Chat[],
  participantId: string | number
) => {
  return chats.find((chat) =>
    chat.participants?.some((p) => String(p.id) === String(participantId))
  );
};
