import { ChatRoomService } from "./chatRoom.service";
import { isNotDefined } from "../utils";


export class ChatRoomController {
    constructor(private chatRoomService: ChatRoomService) {}


    async sendMessage(username: string, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null> {
        if (isNotDefined(message)) {
            throw new Error("message cannot be empty.");
        }
        const sentMessage = await this.chatRoomService.sendMessage(username, message);
        return sentMessage; 
    }

    async getMessages(): Promise<{ userId: number; username: string; message: string; date: string; }[]> {
        const messages = await this.chatRoomService.getMessages();
        return messages;
    }
}
