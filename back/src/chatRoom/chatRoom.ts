import { User } from "../user/user";

export class ChatRoom {
    constructor(
        public id: number,
        public participants: User[] = [],
        public messages: { userId: number, username: string, message: string, date: string }[] = []
    ) {}
}
