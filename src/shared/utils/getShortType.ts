import { ShortChatType} from "shared/types/chat";
import type { ChatType } from "shared/types/chat";




export const getShortType = (type: ChatType): ShortChatType => {
    return type.replace("admin-", "") as ShortChatType;
  };