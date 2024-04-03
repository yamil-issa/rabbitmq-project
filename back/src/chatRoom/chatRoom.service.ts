import { User } from "../user/user";
import { ChatRoom } from "./chatRoom";

export interface ChatRoomService {
    createChatRoom(chatRoomName: string, adminId: number): ChatRoom;
    getChatRoomById(chatRoomId: number): ChatRoom | null;
    getChatRooms(): ChatRoom[];
    joinChatRoom(chatRoomId: number, userId: number): boolean;
    sendMessage(chatRoomId: number, userId: number, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null>;
    
    deleteChatRoom(chatRoomId: number, adminId: number): boolean;
}

