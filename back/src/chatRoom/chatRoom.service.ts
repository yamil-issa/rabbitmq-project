export interface ChatRoomService {
    sendMessage(username: string, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null>;
    getMessages(): Promise<{ userId: number; username: string; message: string; date: string; }[]>;
    
}

