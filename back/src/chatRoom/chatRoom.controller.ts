import { User } from "../user/user";
import { ChatRoom } from "./chatRoom";
import { ChatRoomService } from "./chatRoom.service";
import { containsSpaces, isNegativeNumber, isNotDefined } from "../utils";


export class ChatRoomController {
    constructor(private chatRoomService: ChatRoomService) {}

    createChatRoom(chatRoomName: string, adminId: number): ChatRoom {
        return this.chatRoomService.createChatRoom(chatRoomName, adminId);
    }

    getChatRoomById(chatRoomId: number): ChatRoom | null {
        return this.chatRoomService.getChatRoomById(chatRoomId);
    }
    getChatRooms(): ChatRoom[] {
        return this.chatRoomService.getChatRooms();
    }

    joinChatRoom(chatRoomId: number, userId: number): boolean {
        return this.chatRoomService.joinChatRoom(chatRoomId, userId);
    }

    async sendMessage(chatRoomId: number, userId: number, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null> {
        if (isNotDefined(message)) {
            throw new Error("message is empty.");
        }
        const sentMessage = await this.chatRoomService.sendMessage(chatRoomId, userId, message);
        return sentMessage; 
    }
    deleteChatRoom(chatRoomId: number, adminId: number): boolean {
        return this.chatRoomService.deleteChatRoom(chatRoomId, adminId);
    }
}
