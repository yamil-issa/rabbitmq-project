import { User } from "../user/user";
import { ChatRoom } from "./chatRoom";
import { ChatRoomService } from "./chatRoom.service";
import { containsSpaces, isNegativeNumber, isNotDefined } from "../utils";


export class ChatRoomController {
    constructor(private chatRoomService: ChatRoomService) {}


    joinChatRoom(username: string): boolean {
        return this.chatRoomService.joinChatRoom(username);
    }

    async sendMessage(username: string, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null> {
        if (isNotDefined(message)) {
            throw new Error("message is empty.");
        }
        const sentMessage = await this.chatRoomService.sendMessage(username, message);
        return sentMessage; 
    }
}
