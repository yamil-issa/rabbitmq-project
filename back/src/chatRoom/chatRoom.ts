import { User } from "../user/user";

export class ChatRoom {
    constructor(
        public id: number,
        public chatRoomName: string,
        public adminId: number,
        public isPublic: boolean = true,
        public participants: User[] = [],
        public messages: { userId: number, username: string, message: string, date: string }[] = []
    ) {}
}
