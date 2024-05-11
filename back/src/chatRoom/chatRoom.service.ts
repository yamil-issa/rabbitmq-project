import { User } from "../user/user";
import { ChatRoom } from "./chatRoom";

export interface ChatRoomService {
    joinChatRoom(username: string): boolean;
    sendMessage(username: string, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null>;
    
}

